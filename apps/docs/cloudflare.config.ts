import { defineConfig } from "cf/config"

export default defineConfig({
  worker: {
    name: "shadcn-m3e-docs",
    compatibilityDate: "2026-10-01",
    assets: {
      // serve dist/<route>/index.html at /<route>, like the router's own URLs
      htmlHandling: "drop-trailing-slash",
      // every page is prerendered (see the seo plugin), so a path without a
      // file is a real 404: serve dist/404.html with that status
      notFoundHandling: "404-page",
    },
    observability: {
      enabled: true,
    },
  },
})
