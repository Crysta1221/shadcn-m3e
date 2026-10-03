"use client";

import { useState } from "react";
import {
  Action,
  BACK_TARGET,
  CONTENT_W,
  Frame,
  FramePreset,
  Item,
  PHONE_W,
  Kind,
  Palette,
  TRANSITIONS,
  Transition,
  VARIANTS,
  Variant,
  isFab,
  contentWidth,
  framePresetOf,
  halfWidth,
  isPhoneFrame,
  variantStyle,
} from "@/lib/tokens";
import { ButtonInspector } from "./ButtonInspector";
import { PartInspector } from "./PartInspector";
import { AlignBox, PartMenu, PlaceFn } from "./PartPanel";
import { Icon } from "./M3Node";
import { PanelShell, Section, Segmented } from "./ui";
import { TRANSITION_TEXT, t, useLang } from "@/lib/i18n";

export function variantsOf(kind: Kind): { key: Variant; label: string }[] {
  const variants = VARIANTS.map((v) => ({ ...v, label: t(v.key) }));
  switch (kind) {
    case "card":
      return [
        { key: "tonal", label: t("filled") },
        { key: "elevated", label: t("elevated") },
        { key: "outlined", label: t("outlined") },
      ];
    case "textField":
    case "select":
      return [
        { key: "outlined", label: t("outlined") },
        { key: "filled", label: t("filled") },
      ];
    case "searchBar":
      return [
        { key: "filled", label: t("filled") },
        { key: "outlined", label: t("outlined") },
      ];
    case "chip":
      return [
        { key: "outlined", label: t("outlined") },
        { key: "tonal", label: t("elevated") },
      ];
    case "fab":
    case "extendedFab":
    case "fabMenu":
      return variants.filter((v) => v.key !== "text" && v.key !== "elevated" && v.key !== "outlined");
    case "splitButton":
      return variants.filter((v) => v.key !== "text");
    case "toolbar":
      return [
        { key: "tonal", label: t("standard") },
        { key: "filled", label: t("vibrant") },
      ];
    case "iconButton":
      return variants.filter((v) => v.key !== "elevated" && v.key !== "text").concat({
        key: "text",
        label: t("standard"),
      });
    default:
      return variants;
  }
}

export function VariantSwatch({
  v,
  label,
  p,
  on,
  onClick,
  small,
}: {
  v: Variant;
  label: string;
  p: Palette;
  on: boolean;
  onClick: () => void;
  small?: boolean;
}) {
  const st = variantStyle(v, p);
  const h = small ? 32 : 40;
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={on}
      className="m3-press"
      style={{
        height: h,
        borderRadius: h / 2,
        cursor: "pointer",
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: small ? "0 10px" : "0 12px",
        ...st,
        boxShadow: v === "elevated" ? "0 1px 3px rgba(0,0,0,0.2)" : "none",
        outline: on ? `2px solid ${p.primary}` : "2px solid transparent",
        outlineOffset: 2,
      }}
    >
      {on && <Icon name="check" size={small ? 14 : 16} />}
      {label}
    </button>
  );
}

/** hover text for a width preset derived from the selected frame */
export const widthPresetLabel = (v: number, frameWidth = PHONE_W): string | undefined =>
  v === frameWidth
    ? t("screenWidth")
    : v === contentWidth(frameWidth)
      ? t("contentWidth")
      : v === halfWidth(frameWidth)
        ? t("halfWidth")
        : frameWidth !== PHONE_W && v === CONTENT_W
          ? t("columnWidth")
          : undefined;

export function FrameSizePicker({
  frame,
  palette: p,
  onChange,
  compact,
}: {
  frame: Frame;
  palette: Palette;
  onChange: (preset: FramePreset) => void;
  compact?: boolean;
}) {
  const lang = useLang();
  return (
    <Segmented<FramePreset>
      options={[
        { key: "phone", icon: "smartphone", label: compact ? undefined : t("phoneFrame", lang), title: t("phoneFrame", lang) },
        { key: "desktop", icon: "desktop_windows", label: compact ? undefined : t("desktopFrame", lang), title: t("desktopFrame", lang) },
      ]}
      value={framePresetOf(frame)}
      onChange={onChange}
      p={p}
      height={compact ? 36 : 40}
      grow={!compact}
    />
  );
}

function FrameChips({
  frames,
  value,
  onChange,
  p,
  back,
  small,
}: {
  frames: Frame[];
  value: string | null;
  onChange: (id: string | null) => void;
  p: Palette;
  /** offer "go back" as a target */
  back?: boolean;
  small?: boolean;
}) {
  const lang = useLang();
  const h = small ? 32 : 36;
  const chip = (id: string | null, label: string, icon: string) => {
    const on = value === id;
    return (
      <button
        key={id ?? "none"}
        onClick={() => onChange(id)}
        className="m3-press"
        style={{
          height: h,
          padding: "0 12px 0 8px",
          borderRadius: h / 2,
          border: "none",
          background: on ? p.primary : p.surfaceContainerHigh,
          color: on ? p.onPrimary : p.onSurfaceVariant,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          maxWidth: "100%",
        }}
      >
        <Icon name={icon} size={18} />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      </button>
    );
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {chip(null, t("none", lang), "block")}
      {back && chip(BACK_TARGET, t("goBack", lang), "arrow_back")}
      {frames.map((f) => chip(f.id, f.name || t("screen", lang), isPhoneFrame(f) ? "smartphone" : "desktop_windows"))}
    </div>
  );
}

export function TransitionPicker({ value, onChange, p }: { value: Transition; onChange: (t: Transition) => void; p: Palette }) {
  const lang = useLang();
  return (
    <Segmented<Transition>
      options={TRANSITIONS.map((tr) => ({ key: tr.key, icon: tr.icon, title: TRANSITION_TEXT[lang][tr.key] }))}
      value={value}
      onChange={onChange}
      p={p}
      height={34}
    />
  );
}

/** target frame (or back) plus the transition, for one tap target */
export function ActionEditor({
  frames,
  action,
  onChange,
  p,
}: {
  frames: Frame[];
  action: Action | undefined;
  onChange: (a: Action | undefined) => void;
  p: Palette;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <FrameChips
        frames={frames}
        value={action?.to ?? null}
        onChange={(to) => onChange(to ? { to, transition: action?.transition ?? "slide" } : undefined)}
        p={p}
        back
      />
      {action && action.to !== BACK_TARGET && (
        <TransitionPicker value={action.transition} onChange={(transition) => onChange({ ...action, transition })} p={p} />
      )}
    </div>
  );
}

/** what a field's AI button needs from the page; `reason` explains a disabled button */
export type AiHooks = { ready: boolean; reason?: string; busy: boolean; onRun: () => void; onCancel: () => void };

/** The panel for several parts at once, or for one hand-made group. It wears the chrome a
 *  part's panel does -- the title row with its menu, then short sections -- and holds only what
 *  a selection has: lining its parts up, and making or breaking the group. */
function GroupPanel({
  p,
  count,
  grouped,
  locked,
  onToggleLock,
  onDuplicate,
  onDelete,
  onGroup,
  onUngroup,
  onPlace,
  selectionKey,
}: {
  p: Palette;
  count: number;
  grouped: boolean;
  locked: boolean;
  onToggleLock?: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onGroup?: () => void;
  onUngroup?: () => void;
  onPlace?: PlaceFn;
  /** names the selection, so the spot picked for one is not shown lit for the next */
  selectionKey: string;
}) {
  const lang = useLang();
  const title = grouped ? t("group", lang) : lang === "en" ? `${count} ${t("selectedParts", lang)}` : `${count}${t("selectedParts", lang)}`;
  const toggle = grouped ? onUngroup : onGroup;
  return (
    <PanelShell
      p={p}
      locked={locked}
      onUnlock={onToggleLock}
      head={
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, padding: "0 2px 0 6px", color: p.onSurfaceVariant }}>
          <Icon name={grouped ? "group_work" : "select_all"} size={20} />
          <span style={{ fontSize: 14, fontWeight: 600, flex: 1, minWidth: 0, color: p.onSurface }}>{title}</span>
          <PartMenu p={p} locked={locked} onDuplicate={onDuplicate} onToggleLock={onToggleLock} onDelete={onDelete} deleteLabel={t("deleteSelection", lang)} />
        </div>
      }
    >
      {onPlace && (
        <Section id="group-align" icon="grid_on" title={t("align", lang)} p={p}>
          <AlignBox key={selectionKey} onPlace={onPlace} p={p} />
        </Section>
      )}
      {/* the header already names the group, so the button that makes or breaks it stands under the sections without a title of its own */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 4px" }}>
        <button
          onClick={toggle}
          className="m3-press"
          style={{
            height: 44,
            borderRadius: 22,
            border: "none",
            background: p.secondaryContainer,
            color: p.onSecondaryContainer,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
          }}
        >
          <Icon name={grouped ? "ungroup" : "group_work"} size={20} />
          {t(grouped ? "ungroup" : "makeGroup", lang)}
        </button>
        <div style={{ fontSize: 12, lineHeight: 1.5, color: p.onSurfaceVariant, padding: "0 4px", textWrap: "pretty" }}>{t(grouped ? "groupEditNote" : "groupHint", lang)}</div>
      </div>
    </PanelShell>
  );
}

export function Inspector({
  ai,
  item,
  palette: p,
  frames,
  frame,
  onChange,
  onDelete,
  onDuplicate,
  locked,
  onToggleLock,
  multi,
  grouped,
  selectionWhole,
  selectionKey,
  railStandalone = false,
  onGroup,
  onUngroup,
  widths,
  onPlace,
  selfRect,
  allFrames,
  onShowOn,
  onShowMenu,
}: {
  /** the AI button beside the behavior field */
  ai: AiHooks;
  item: Item | null;
  palette: Palette;
  frames: Frame[];
  /** frame containing the selected part; its dimensions bound size controls */
  frame?: Frame | null;
  onChange: (patch: Partial<Item>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  /** every group holding the selection is locked */
  locked?: boolean;
  onToggleLock?: () => void;
  multi: number;
  /** the selection is exactly one hand-made group */
  grouped?: boolean;
  /** the selection covers every group it touches, so a lock on it holds nothing more */
  selectionWhole?: boolean;
  /** the selected ids, joined: tells one multi-selection from the next */
  selectionKey?: string;
  /** Modal expansion is available only when this rail owns its group. */
  railStandalone?: boolean;
  onGroup?: () => void;
  onUngroup?: () => void;
  /** measured widths of the parts that size themselves to their text */
  widths?: Record<string, number>;
  /** puts the selection at one of nine spots in its screen's body, clear of the parts already there */
  onPlace?: (col: "left" | "centerH" | "right", row: "top" | "centerV" | "bottom") => void;
  /** where the selected part sits on the canvas, for the tap map */
  selfRect?: { x: number; y: number; w: number; h: number } | null;
  /** every screen on the canvas, whatever the frame mode; the tap map draws them all */
  allFrames?: Frame[];
  /** the canvas should draw the selected toggle button in its "on" look */
  onShowOn?: (on: boolean) => void;
  /** asks the canvas to show a FAB's menu open while it is being set up */
  onShowMenu?: (open: boolean) => void;
}) {
  const lang = useLang();

  if (!item) {
    if (multi > 1) {
      return (
        <GroupPanel
          p={p}
          count={multi}
          grouped={!!grouped}
          locked={!!locked}
          /* a loose selection locks only when that locks nothing more than it; a lock already on can always come off */
          onToggleLock={locked || selectionWhole ? onToggleLock : undefined}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onGroup={onGroup}
          onUngroup={onUngroup}
          onPlace={onPlace}
          selectionKey={selectionKey ?? ""}
        />
      );
    }
    return (
      <div
        style={{
          height: "100%",
          display: "grid",
          placeItems: "center",
          color: p.outlineVariant,
          padding: 24,
          textAlign: "center",
        }}
      >
        <Icon name="ads_click" size={44} />
      </div>
    );
  }

  /* the parts a tap sends somewhere and that fuse into a run are edited in the button's panel */
  if (item.kind === "button" || item.kind === "iconButton" || item.kind === "chip" || item.kind === "splitButton" || isFab(item.kind)) {
    return <ButtonInspector ai={ai} item={item} palette={p} frame={frame ?? null} onChange={onChange} onDelete={onDelete} onDuplicate={onDuplicate} locked={locked} onToggleLock={onToggleLock} onPlace={onPlace} measured={widths?.[item.id]} selfRect={selfRect ?? null} allFrames={allFrames ?? frames} onShowOn={onShowOn} onShowMenu={onShowMenu} />;
  }

  /* everything else shares one panel, built from the button's own */
  return (
    <PartInspector
      ai={ai}
      item={item}
      palette={p}
      frame={frame ?? null}
      onChange={onChange}
      onDelete={onDelete}
      onDuplicate={onDuplicate}
      locked={locked}
      onToggleLock={onToggleLock}
      onPlace={onPlace}
      selfRect={selfRect ?? null}
      allFrames={allFrames ?? frames}
      measured={widths?.[item.id]}
      railStandalone={railStandalone}
    />
  );
}
