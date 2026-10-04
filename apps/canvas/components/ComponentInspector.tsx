"use client";

import { useState } from "react";
import { Frame, Item, NavTab, Palette } from "@/lib/tokens";
import { t, useLang } from "@/lib/i18n";
import { partBySlug, reader } from "@/parts/registry";
import type { ListItem, PropDef } from "@/parts/types";
import { AiHooks } from "./Inspector";
import { AlignBox, EntryList, IconRow, NoteSection, PartHeader, PartTabs, PlaceFn, Tab, TriggerSection } from "./PartPanel";
import { Field, PanelShell, Section, Segmented, Select, Slider, Toggle } from "./ui";

/* The panel of a part that is a real shadcn M3E component. It is built from the part's own prop
 * definitions: text, choices, switches, numbers, icons and lists, each drawn with the controls
 * the other panels use, and written back into `item.props`. */

const choices = (def: Extract<PropDef, { kind: "enum" }>) => def.options.map((o) => (typeof o === "string" ? { key: o, label: o } : { key: o.value, label: o.label }));

/** a list prop is edited as the rows the entry list knows: a label, and an icon when the part has them */
const toRows = (list: ListItem[]): NavTab[] => list.map((x) => ({ icon: x.icon ?? "", label: x.label }));
const fromRows = (rows: NavTab[], icons: boolean): ListItem[] => rows.map((x) => (icons && x.icon ? { label: x.label, icon: x.icon } : { label: x.label }));

function PropRow({ def, value, onChange, item, p }: { def: PropDef; value: unknown; onChange: (v: unknown) => void; item: Item; p: Palette }) {
  const label = <div style={{ fontSize: 12, fontWeight: 600, color: p.onSurfaceVariant, padding: "0 4px 6px" }}>{def.label}</div>;
  switch (def.kind) {
    case "text":
      return (
        <div>
          {label}
          <Field value={String(value ?? "")} onChange={onChange} placeholder={def.label} p={p} multiline={def.multiline} rows={3} height={44} />
        </div>
      );
    case "enum": {
      const options = choices(def);
      return (
        <div>
          {label}
          {options.length <= 3 ? (
            <Segmented<string> options={options} value={String(value)} onChange={onChange} p={p} height={40} label={def.label} />
          ) : (
            <Select options={options} value={String(value)} onChange={onChange} p={p} label={def.label} />
          )}
        </div>
      );
    }
    case "bool":
      return <Toggle on={value === true} onChange={onChange} p={p} label={def.label} grow />;
    case "number":
      return (
        <div>
          {label}
          <Slider value={Number(value)} min={def.min} max={def.max} step={def.step ?? 1} unit={def.unit} title={def.label} onChange={onChange} p={p} />
        </div>
      );
    case "icon":
      return (
        <div>
          {label}
          <IconRow slots={[{ key: def.key, value: typeof value === "string" && value ? value : null, title: def.label }]} onPick={(_, icon) => onChange(icon ?? "")} p={p} />
        </div>
      );
    case "list": {
      const list = (value as ListItem[]) ?? [];
      const icons = def.icons === true;
      /* the entry list takes its bounds and its spare rows from the kind: a bar's, or a tab row's */
      const like: Item["kind"] = icons && (def.min ?? 0) >= 3 ? "bottomNav" : "tabs";
      const rows: Item = { ...item, kind: like, tabs: toRows(list) };
      return (
        <div>
          {label}
          <EntryList
            item={rows}
            icons={icons}
            onChange={(patch) => {
              if (!patch.tabs) return;
              const next = fromRows(patch.tabs, icons);
              if (next.length < (def.min ?? 1) || next.length > (def.max ?? 12)) return;
              onChange(next);
            }}
            p={p}
          />
        </div>
      );
    }
  }
}

/** the controls of a part's props, one per prop */
export function ComponentProps({ item, palette: p, onChange }: { item: Item; palette: Palette; onChange: (patch: Partial<Item>) => void }) {
  const def = partBySlug(item.component);
  if (!def) return null;
  const values = reader(def, item.props);
  const read = (d: PropDef) => (d.kind === "text" || d.kind === "icon" || d.kind === "enum" ? values.s(d.key) : d.kind === "bool" ? values.b(d.key) : d.kind === "number" ? values.n(d.key) : values.list(d.key));
  const set = (key: string, v: unknown) => onChange({ props: { ...item.props, [key]: v } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {def.props.map((d) => (
        <PropRow key={d.key} def={d} value={read(d)} onChange={(v) => set(d.key, v)} item={item} p={p} />
      ))}
    </div>
  );
}

export function ComponentInspector({
  ai,
  item,
  palette: p,
  frame,
  onChange,
  onDelete,
  onDuplicate,
  locked,
  onToggleLock,
  onPlace,
  selfRect,
  allFrames,
}: {
  ai: AiHooks;
  item: Item;
  palette: Palette;
  frame: Frame | null;
  onChange: (patch: Partial<Item>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  locked?: boolean;
  onToggleLock?: () => void;
  onPlace?: PlaceFn;
  selfRect: { x: number; y: number; w: number; h: number } | null;
  allFrames: Frame[];
}) {
  const lang = useLang();
  const [tab, setTab] = useState<Tab>("design");
  const def = partBySlug(item.component);
  if (!def) return null;

  return (
    <PanelShell
      p={p}
      locked={!!locked}
      onUnlock={onToggleLock}
      head={<PartHeader kind={item.kind} title={def.name} icon={def.icon} p={p} locked={!!locked} onDuplicate={onDuplicate} onToggleLock={onToggleLock} onDelete={onDelete} />}
      tabs={<PartTabs value={tab} onChange={setTab} p={p} />}
    >
      {tab === "design" && (
        <div role="tabpanel" id="part-panel-design" aria-labelledby="part-tab-design">
          <Section id="part-props" icon="tune" title={t("style", lang)} p={p}>
            <ComponentProps item={item} palette={p} onChange={onChange} />
          </Section>
          {onPlace && (
            <Section id="part-align" icon="grid_on" title={t("align", lang)} p={p}>
              <AlignBox key={item.id} onPlace={onPlace} p={p} />
            </Section>
          )}
        </div>
      )}
      {tab === "behavior" && (
        <div role="tabpanel" id="part-panel-behavior" aria-labelledby="part-tab-behavior">
          <TriggerSection item={item} frame={frame} allFrames={allFrames} selfRect={selfRect} onChange={onChange} p={p} />
          <NoteSection item={item} ai={ai} onChange={onChange} p={p} />
        </div>
      )}
    </PanelShell>
  );
}
