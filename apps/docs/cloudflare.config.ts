import { defineConfig } from "cf/config"

export default defineConfig({
  worker: {
    name: "shadcn-m3e-docs",
    compatibilityDate: "2026-10-01",
    assets: {
      // the build writes dist/<route>/index.html per page (the seo plugin in
      // vite.config.ts); serve them at /<route> like the router's own URLs
      htmlHandling: "drop-trailing-slash",
      // TanStack Router handles client-side routing; unknown paths serve index.html
      notFoundHandling: "single-page-application",
    },
    observability: {
      enabled: true,
    },
  },
})
