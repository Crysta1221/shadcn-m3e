import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, lazyPlugins } from "vite-plus"

// The shipped code lives in packages/m3e; its `@/…` import specifiers are the
// ones consumers get from shadcn, so they are mapped here (and in
// tsconfig.paths.json), most specific first.
const m3e = path.resolve(__dirname, "../../packages/m3e/src")

// https://vite.dev/config/
export default defineConfig({
  plugins: lazyPlugins(() => [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
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
