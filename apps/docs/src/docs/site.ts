/** Where the hosted site, and its shadcn registry at `/r`, are served from. */
export const SITE_ORIGIN = "https://shadcn-m3e.crystaworld.dev"

/**
 * Where the Playground (apps/canvas, a static Next.js export) is hosted. Set
 * VITE_PLAYGROUND_URL to point the site somewhere else.
 */
export const PLAYGROUND_ORIGIN: string =
  import.meta.env.VITE_PLAYGROUND_URL ??
  (import.meta.env.DEV
    ? "http://localhost:3000"
    : "https://canvas.shadcn-m3e.crystaworld.dev")
