import fs from "node:fs"
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, lazyPlugins } from "vite-plus"
import type { Plugin } from "vite-plus"

import { PAGE_PATHS, headTags, pageMeta } from "./src/docs/page-meta"

// The shipped code lives in packages/m3e; its `@/…` import specifiers are the
// ones consumers get from shadcn, so they are mapped here (and in
// tsconfig.paths.json), most specific first.
const m3e = path.resolve(__dirname, "../../packages/m3e/src")

const SEO_BLOCK = /( *<!-- seo:start -->)[\s\S]*?(<!-- seo:end -->)/

// a replacer function, so `$` in a description is not read as a pattern
const fill = (html: string, pathname: string) =>
  html.replace(
    SEO_BLOCK,
    (_, start: string, end: string) =>
      `${start}
${headTags(pageMeta(pathname))}
    ${end}`
  )

/**
 * Fills the `seo` block of index.html with the page title, description and
 * Open Graph / Twitter tags. The build also writes one copy of the HTML per
 * route (dist/docs/color/index.html, …): Workers Assets serves a file before
 * its single-page-app fallback, so crawlers, which do not run scripts, get the
 * right text for each page. Anything without a file still gets the home tags
 * and the client updates them (see usePageMeta).
 */
function seo(): Plugin {
  let outDir = "dist"
  return {
    name: "m3e-seo",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    transformIndexHtml: {
      order: "pre",
      handler: (html) => fill(html, "/"),
    },
    closeBundle() {
      const indexPath = path.join(outDir, "index.html")
      if (!fs.existsSync(indexPath)) return
      const html = fs.readFileSync(indexPath, "utf8")
      for (const pathname of PAGE_PATHS) {
        const file =
          pathname === "/"
            ? indexPath
            : path.join(outDir, ...pathname.split("/"), "index.html")
        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, fill(html, pathname))
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: lazyPlugins(() => [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    seo(),
  ]),
  resolve: {
    alias: [
      // configured cn (M3 type scale etc.), see packages/m3e/src/lib/cn.ts
      { find: /^cn$/, replacement: path.join(m3e, "lib/cn.ts") },
      {
        find: /^@\/components\/m3e\//,
        replacement: path.join(m3e, "components") + "/",
      },
      { find: /^@\/lib\/m3e\//, replacement: path.join(m3e, "lib") + "/" },
      { find: /^@\/hooks\//, replacement: path.join(m3e, "hooks") + "/" },
      { find: /^@\/styles\//, replacement: path.join(m3e, "styles") + "/" },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
})
