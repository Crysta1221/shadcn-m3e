// the shadcn M3E components pass CSS custom properties in `style`
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}

export {};
