
import { createElement, type ReactNode } from "react";
import { COMPONENTS } from "./components";
import { isNode, isRaw, isWrap, type PNode, type PValue } from "./node";

/** a prop value with its nodes turned into elements and its raw code dropped */
function value(v: PValue, key?: string): unknown {
  if (isRaw(v)) return undefined;
  if (isWrap(v)) return (element: ReactNode) => createElement(COMPONENTS[v.$wrap], { render: element });
  if (isNode(v)) return renderNode(v, key);
  if (Array.isArray(v)) return v.map((x, i) => value(x, String(i)));
  if (typeof v === "object" && v !== null) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, value(x, k)]));
  return v;
}

/** draw a node with the real component it names (or the HTML tag) */
export function renderNode(node: PNode | string, key?: string | number): ReactNode {
  if (typeof node === "string") return node;
  const type = COMPONENTS[node.type] ?? node.type;
  const props: Record<string, unknown> = { key };
  for (const [k, v] of Object.entries(node.props ?? {})) {
    const out = value(v, k);
    if (out !== undefined) props[k] = out;
  }
  const children = (node.children ?? []).map((c, i) => renderNode(c, i));
  return createElement(type, props, ...children);
}
