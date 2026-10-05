
import { createContext, useContext } from "react";
import { t, useLang } from "@/lib/i18n";
import type { Palette } from "@/lib/tokens";
import { Icon } from "./M3Node";

/** What the panel of the selected part can do about the old hand-drawn part it may be: turn it
 *  into the real component, or (once it was) switch back. The editor provides it for the part in play. */
export type MigrateActions = { onMigrate?: () => void; onRevert?: () => void };
export const MigrateContext = createContext<MigrateActions>({});

/** The card at the top of a part's panel that offers the conversion, or the way back from it. */
export function MigrateNotice({ p, margin = "0 0 14px" }: { p: Palette; margin?: string }) {
  const lang = useLang();
  const { onMigrate, onRevert } = useContext(MigrateContext);
  const go = onMigrate ?? onRevert;
  if (!go) return null;
  const forward = !!onMigrate;
  return (
    <div style={{ margin, padding: 12, borderRadius: 16, background: p.tertiaryContainer, color: p.onTertiaryContainer, display: "flex", flexDirection: "column", gap: 10 }}>
      {forward && <span style={{ fontSize: 12, lineHeight: 1.45 }}>{t("migrateHint", lang)}</span>}
      <button
        onClick={go}
        className="m3-press"
        style={{
          minHeight: 40,
          padding: "8px 16px",
          borderRadius: 20,
          border: "none",
          background: p.primary,
          color: p.onPrimary,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Icon name={forward ? "upgrade" : "undo"} size={20} />
        {t(forward ? "migrate" : "migrateRevert", lang)}
      </button>
    </div>
  );
}
