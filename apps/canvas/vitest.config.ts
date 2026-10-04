import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));
const m3e = here("../../packages/m3e/src");

// the same `@/…` mapping as tsconfig.json: the shadcn M3E imports first, then the app's own
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\/components\/m3e\//, replacement: `${m3e}/components/` },
      { find: /^@\/lib\/m3e\//, replacement: `${m3e}/lib/` },
      { find: /^@\/hooks\//, replacement: `${m3e}/hooks/` },
      { find: /^@\/styles\//, replacement: `${m3e}/styles/` },
      { find: /^@\//, replacement: here("./") },
    ],
  },
  test: {
    // its ESM imports have no file extension, which Node cannot resolve; the bundler can
    server: { deps: { inline: [/material-color-utilities/] } },
  },
});
