
import { useEffect, useSyncExternalStore } from "react";
import { registerIcons } from "@/components/m3e/icon-registry";
import { isNode, isRaw, type PNode, type PValue } from "./node";

/* The M3E components draw icons from bundled data (only the glyphs their own code uses). A
 * sketch may use any Material Symbol, so the ones the parts name are fetched from Iconify
 * once, registered, and the parts drawn again. The code the canvas prints is unchanged:
 * `bun run gen:icons` bundles them in the project that uses it. */

const API = "https://api.iconify.design/material-symbols.json";
const asked = new Set<string>();
let version = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | undefined;
const pending = new Set<string>();

const ids = (name: string) => {
  const base = name.replaceAll("_", "-");
  return [`${base}-outline-rounded`, `${base}-rounded`];
};

async function flush() {
  const names = [...pending];
  pending.clear();
  for (let i = 0; i < names.length; i += 60) {
    const chunk = names.slice(i, i + 60);
    try {
      const res = await fetch(`${API}?icons=${chunk.join(",")}`);
      if (!res.ok) continue;
      registerIcons(await res.json());
      version++;
      listeners.forEach((l) => l());
    } catch {
      // offline: the parts keep drawing the icons that are bundled
    }
  }
}

/** ask for the icons a part uses; the ones already asked for are skipped */
export function ensureIcons(names: Iterable<string>) {
  if (typeof window === "undefined") return;
  for (const name of names) {
    if (!name) continue;
    for (const id of ids(name)) {
      if (asked.has(id)) continue;
      asked.add(id);
      pending.add(id);
    }
  }
  if (pending.size && timer === undefined) {
    timer = setTimeout(() => {
      timer = undefined;
      void flush();
    }, 30);
  }
}

/** the icon names a tree uses: `<Icon name>` and the `icon`-like string props */
export function iconNamesIn(node: PNode, into = new Set<string>()): Set<string> {
  const visit = (v: PValue): void => {
    if (isRaw(v)) return;
    if (isNode(v)) iconNamesIn(v, into);
    else if (Array.isArray(v)) v.forEach(visit);
    else if (typeof v === "object" && v !== null) Object.values(v).forEach(visit);
  };
  if (node.type === "Icon" && typeof node.props?.name === "string") into.add(node.props.name);
  for (const [k, v] of Object.entries(node.props ?? {})) {
    if (typeof v === "string" && (k === "icon" || k === "leadingIcon" || k === "trailingIcon")) into.add(v);
    else visit(v);
  }
  for (const c of node.children ?? []) if (typeof c !== "string") iconNamesIn(c, into);
  return into;
}

/** draw again when icons have arrived */
export function useIconVersion() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => version,
    () => 0,
  );
}

/** fetch the icons of a tree, and say when more have arrived */
export function useIcons(node: PNode) {
  const names = [...iconNamesIn(node)].join(",");
  useEffect(() => ensureIcons(names ? names.split(",") : []), [names]);
  return useIconVersion();
}
