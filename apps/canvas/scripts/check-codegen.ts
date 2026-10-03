// bun run check:codegen
//
// Generates code for a sketch holding one part of every kind and type-checks it
// against the real shadcn M3E components in packages/m3e, so a wrong component
// name, prop or prop value fails here rather than in someone's project.
//
// The generated file is written into the docs app (its tsconfig already maps the
// `@/components/m3e/*` imports) and removed again afterwards.
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildCode } from "../lib/codegen";
import { allKindsDoc } from "../lib/codegen.fixture";
import { setGlobalLang } from "../lib/i18n";

setGlobalLang("en");

const repo = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const docs = join(repo, "apps", "docs");
const dir = join(docs, "src", "__codegen__");
const file = join(dir, "screens.tsx");

const { code } = buildCode(allKindsDoc(), {});
mkdirSync(dir, { recursive: true });
writeFileSync(file, code);
let status = 1;
try {
  const run = spawnSync("bun", ["run", "--cwd", docs, "typecheck"], { encoding: "utf8", shell: true });
  const out = `${run.stdout}${run.stderr}`;
  const errors = out.split("\n").filter((l) => l.includes("__codegen__"));
  if (errors.length) {
    console.log(errors.join("\n"));
    console.log(`${errors.length} problem(s) in the generated code (${file})`);
  } else if (run.status !== 0) {
    console.log(out);
    console.log("typecheck failed outside the generated code");
  } else {
    console.log(`generated code type-checks (${code.split("\n").length} lines)`);
    status = 0;
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
process.exit(status);
