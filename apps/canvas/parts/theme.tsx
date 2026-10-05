
import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import { themeCss } from "@/lib/m3e/color";

/** the sketch's color scheme, as the shadcn M3E components see it */
export type PartTheme = {
  /** the color the scheme is generated from */
  seed: string;
  dark: boolean;
  contrast: "standard" | "medium" | "high";
  /** M3 shape scale: 0.35 is about square, 1 the standard corners, 1.6 about round */
  shape: number;
};

export const DEFAULT_PART_THEME: PartTheme = { seed: "#6750A4", dark: false, contrast: "standard", shape: 1 };
export const PartThemeContext = createContext<PartTheme>(DEFAULT_PART_THEME);
export const usePartTheme = () => useContext(PartThemeContext);

const SCOPE = "m3-part-scope";

/** The scheme's CSS variables for every part. Rendered once; the baseline variant is what
 *  `M3eProvider` uses without a variant, so the code the canvas prints looks the same. */
export function PartThemeStyle({ seed, contrast }: Pick<PartTheme, "seed" | "contrast">) {
  const css = themeCss({ source: { primary: seed }, variant: "baseline", contrast }, { light: `.${SCOPE}`, dark: `.dark .${SCOPE}` });
  /* an overlay drawn open inside its box has no page to dim */
  const overlays = ["dialog", "alert-dialog", "sheet", "drawer"].map((s) => `.${SCOPE} [data-slot="${s}-overlay"]`).join(", ");
  return <style id="m3-part-theme">{`${css}\n${overlays} { display: none; }`}</style>;
}

/** what a part is drawn inside: the scheme's scope, in dark mode when the sketch is. It adds no box. */
export function PartSurface({ children }: { children: ReactNode }) {
  const { dark, shape } = usePartTheme();
  const style = { display: "contents", "--md-sys-shape-scale": shape } as CSSProperties;
  return (
    <div className={dark ? "dark" : undefined} style={{ display: "contents" }}>
      <div className={SCOPE} style={style}>
        {children}
      </div>
    </div>
  );
}
