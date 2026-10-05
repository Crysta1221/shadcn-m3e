import { defineConfig } from "cf/config"

export default defineConfig({
  worker: {
    name: "shadcn-m3e-docs",
    compatibilityDate: "2026-10-01",
    assets: {
      // TanStack Router handles client-side routing; unknown paths serve index.html
      notFoundHandling: "single-page-application",
    },
    observability: {
      enabled: true,
    },
  },
})
