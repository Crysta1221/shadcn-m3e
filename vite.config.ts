import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, lazyPlugins } from "vite-plus"

// https://vite.dev/config/
export default defineConfig({
  fmt: {
    semi: false,
    singleQuote: false,
    trailingComma: "es5",
    printWidth: 80,
    sortTailwindcss: {
      stylesheet: "./src/index.css",
      functions: ["cn", "cva"],
    },
    ignorePatterns: [
      "src/routeTree.gen.ts",
      "bun.lock",
      "src/components/ui/**",
      "src/components/m3e/icon-data*.ts",
      "src/docs/registry-meta.generated.ts",
      "public/r/**",
      "videos/**",
    ],
  },
  lint: {
    plugins: ["typescript", "react", "unicorn", "oxc", "import", "jsx-a11y"],
    categories: {
      correctness: "error",
      suspicious: "warn",
    },
    env: {
      browser: true,
      es2024: true,
    },
    settings: {
      tailwindcss: {
        entryPoint: "./src/index.css",
      },
    },
    ignorePatterns: [
      "dist",
      "src/routeTree.gen.ts",
      "src/components/ui",
      "public/r",
      "videos",
    ],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
      "jsx-a11y/prefer-tag-over-role": "warn",
      "react/set-state-in-effect": "warn",
      "jsx-a11y/control-has-associated-label": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
      "jsx-a11y/label-has-associated-control": "warn",
      "jsx-a11y/no-noninteractive-tabindex": "warn",
      "import/no-unassigned-import": [
        "warn",
        {
          allow: ["**/*.css", "**/icon-registry*"],
        },
      ],
      "vite-plus/prefer-vite-plus-imports": "error",
      "tailwindcss/enforce-canonical": "warn",
    },
    overrides: [
      {
        files: [
          "src/routes/**",
          "src/docs/examples/**",
          "src/components/m3e/**",
        ],
        rules: {
          "react/only-export-components": "off",
        },
      },
      {
        files: ["src/components/m3e/**"],
        rules: {
          "jsx-a11y/prefer-tag-over-role": "off",
        },
      },
      {
        files: ["src/components/m3e/expressive-carousel.tsx"],
        rules: {
          "jsx-a11y/no-noninteractive-tabindex": "off",
          "jsx-a11y/no-noninteractive-element-interactions": "off",
        },
      },
      {
        files: ["src/components/m3e/input-group.tsx"],
        rules: {
          "jsx-a11y/click-events-have-key-events": "off",
          "jsx-a11y/no-noninteractive-element-interactions": "off",
        },
      },
      {
        files: ["src/components/m3e/label.tsx"],
        rules: {
          "jsx-a11y/label-has-associated-control": "off",
        },
      },
    ],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
      {
        name: "tailwindcss",
        specifier: "oxlint-tailwindcss",
      },
    ],
  },
  plugins: lazyPlugins(() => [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ]),
  resolve: {
    alias: [
      // configured cn (M3 type scale etc.), see src/lib/m3e/cn.ts
      {
        find: /^cn$/,
        replacement: path.resolve(__dirname, "./src/lib/m3e/cn.ts"),
      },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
})
