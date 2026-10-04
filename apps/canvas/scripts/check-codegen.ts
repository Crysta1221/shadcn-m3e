// bun run check:codegen
//
// Type-checks the code the canvas prints against the real shadcn M3E components in
// packages/m3e, so a wrong component name, prop or prop value fails here rather than in
// someone's project:
//   1. a sketch holding one of every older part kind (lib/codegen.ts), and the same sketch
//      with every part converted to the component that stands for it (lib/migrate.ts)
//   2. every part of the registry (parts/): its default props, and one instance for every
//      choice of every enum prop
// It also checks that the registry lists the same components as the docs.
//
// The generated files are written into the docs app (its tsconfig already maps the
// `@/components/m3e/*` imports) and removed again afterwards.
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildCode } from "../lib/codegen";
import { allKindsDoc } from "../lib/codegen.fixture";
import { setGlobalLang } from "../lib/i18n";
import { migrateLegacy } from "../lib/migrate";
import type { Item } from "../lib/tokens";
import { importLines, namesIn, printNode } from "../parts/print";
import { PARTS, defaultValues, treeOf } from "../parts/registry";

setGlobalLang("en");

const repo = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const docs = join(repo, "apps", "docs");
const dir = join(docs, "src", "__codegen__");
const tag = `${process.pid}`;
const sketchFile = join(dir, `sketch-${tag}.tsx`);
const partsFile = join(dir, `parts-${tag}.tsx`);
const migratedFile = join(dir, `migrated-${tag}.tsx`);

/* --- the registry lists what the docs list --------------------------------------------- */
const { DOCS } = (await import(join(docs, "src", "docs", "registry.ts"))) as { DOCS: { slug: string; name: string; category: string }[] };
const have = new Map(PARTS.map((d) => [d.slug, d]));
const problems: string[] = [];
for (const d of DOCS) {
  const part = have.get(d.slug);
  if (!part) problems.push(`missing part: ${d.slug} (${d.name})`);
  else if (part.name !== d.name || part.category !== d.category) problems.push(`${d.slug}: the docs call it "${d.name}" in ${d.category}, the part "${part.name}" in ${part.category}`);
}
for (const p of PARTS) if (!DOCS.some((d) => d.slug === p.slug)) problems.push(`not in the docs: ${p.slug}`);

/* --- every part, with every choice of every enum --------------------------------------- */
const pascal = (s: string) => s.replace(/(^|[-_ ])([a-z0-9])/g, (_, __, c: string) => c.toUpperCase()).replace(/[^A-Za-z0-9]/g, "");
const names = new Set<string>();
const bodies: string[] = [];
let instances = 0;
for (const d of PARTS) {
  const base = defaultValues(d);
  const variants: [string, Record<string, unknown>][] = [["Default", base]];
  for (const p of d.props)
    if (p.kind === "enum")
      for (const o of p.options) {
        const value = typeof o === "string" ? o : o.value;
        if (value !== p.default) variants.push([`${pascal(p.key)}${pascal(value)}`, { ...base, [p.key]: value }]);
      }
    else if (p.kind === "bool") variants.push([`${pascal(p.key)}${p.default ? "Off" : "On"}`, { ...base, [p.key]: !p.default }]);
  for (const [label, values] of variants) {
    const tree = treeOf(d, values);
    for (const n of namesIn(tree)) names.add(n);
    bodies.push(`export function ${pascal(d.slug)}${label}() {\n  return (\n${printNode(tree, 2).join("\n")}\n  )\n}`);
    instances++;
  }
}
const partsCode = [...importLines(names), "", ...bodies, ""].join("\n");

const { code: sketchCode } = buildCode(allKindsDoc(), {});
/* the old sketch, every part that has a counterpart turned into it */
const converted = allKindsDoc();
converted.groups = converted.groups.map((g) => ({
  ...g,
  items: g.items.map((it): Item => {
    const m = migrateLegacy(it);
    return m ? ({ ...it, ...m.patch } as Item) : it;
  }),
}));
const { code: migratedCode } = buildCode(converted, {});
mkdirSync(dir, { recursive: true });
writeFileSync(sketchFile, sketchCode);
writeFileSync(migratedFile, migratedCode);
writeFileSync(partsFile, partsCode);

let status = 1;
try {
  const run = spawnSync("bun", ["run", "--cwd", docs, "typecheck"], { encoding: "utf8", shell: true });
  const out = `${run.stdout}${run.stderr}`;
  const errors = out.split("\n").filter((l) => l.includes(`-${tag}.tsx`));
  for (const e of errors) problems.push(e.replace(/^.*__codegen__[\\/]/, ""));
  if (problems.length) {
    console.log(problems.join("\n"));
    console.log(`${problems.length} problem(s)`);
  } else if (run.status !== 0 && !out.includes("__codegen__")) {
    console.log(out);
    console.log("typecheck failed outside the generated code");
  } else {
    console.log(`${PARTS.length} parts match the docs; ${instances} part instances, the sketch and its converted twin type-check`);
    status = 0;
  }
} finally {
  rmSync(sketchFile, { force: true });
  rmSync(migratedFile, { force: true });
  rmSync(partsFile, { force: true });
}
process.exit(status);
