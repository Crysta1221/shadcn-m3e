import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, lazyPlugins } from "vite-plus"

// The shadcn M3E imports (`@/components/m3e/*` …) point into packages/m3e,
// the same mapping as tsconfig.json and vitest.config.ts.
const m3e = path.resolve(__dirname, "../../packages/m3e/src")

// Deployed under this path when VITE_BASE_PATH is set (e.g. "/m3e-canvas");
// SITE_ORIGIN only feeds absolute URLs in the head metadata.
const basePath = process.env.VITE_BASE_PATH ?? "/"
const siteOrigin = process.env.VITE_SITE_ORIGIN ?? "https://m3e-canvas.crystaworld.dev"

export default defineConfig({
  base: basePath,
  plugins: lazyPlugins(() => [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    {
      name: "canvas-meta",
      transformIndexHtml: (html) =>
        html
          .replaceAll("%SITE_ORIGIN%", siteOrigin)
          .replaceAll("%BASE%", basePath.replace(/\/$/, "")),
    },
  ]),
  resolve: {
    alias: [
      { find: /^@\/components\/m3e\//, replacement: `${m3e}/components/` },
      { find: /^@\/lib\/m3e\//, replacement: `${m3e}/lib/` },
      { find: /^@\/hooks\//, replacement: `${m3e}/hooks/` },
      { find: /^@\/styles\//, replacement: `${m3e}/styles/` },
      { find: /^@\//, replacement: `${__dirname}/` },
    ],
  },
  server: { port: 3000 },
})
