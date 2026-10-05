// kept in its own file so vite.config.ts can read it without `import.meta.env`
export { SITE_ORIGIN } from "./origin"

/**
 * Where the Playground (apps/canvas, a static Next.js export) is hosted. Set
 * VITE_PLAYGROUND_URL to point the site somewhere else.
 */
export const PLAYGROUND_ORIGIN: string =
  import.meta.env.VITE_PLAYGROUND_URL ??
  (import.meta.env.DEV
    ? "http://localhost:3000"
    : "https://canvas.shadcn-m3e.crystaworld.dev")
