declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined
  }
}

// oxlint-disable-next-line unicorn/require-module-specifiers
export {}
