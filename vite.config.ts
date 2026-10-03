import { defineConfig } from "vite-plus"

// Lint and format settings for the whole repository (run from the root:
// bun run lint / format). The docs app has its own vite.config.ts for the dev
// server and the build.
export default defineConfig({
  fmt: {
    semi: false,
    singleQuote: false,
    trailingComma: "es5",
    printWidth: 80,
    sortTailwindcss: {
      stylesheet: "./apps/docs/src/index.css",
      functions: ["cn", "cva"],
    },
    ignorePatterns: [
      "apps/docs/src/routeTree.gen.ts",
      "bun.lock",
      "packages/m3e/reference/ui/**",
      "packages/m3e/src/components/icon-data*.ts",
      "apps/docs/src/docs/registry-meta.generated.ts",
      "apps/docs/public/r/**",
      "videos/**",
      "apps/canvas/**",
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
        entryPoint: "./apps/docs/src/index.css",
      },
    },
    ignorePatterns: [
      "dist",
      "apps/docs/src/routeTree.gen.ts",
      "packages/m3e/reference/ui",
      "apps/docs/public/r",
      "videos",
      "apps/canvas",
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
          "apps/docs/src/routes/**",
          "apps/docs/src/docs/examples/**",
          "apps/docs/src/docs/showcases/**",
          "packages/m3e/src/components/**",
        ],
        rules: {
          "react/only-export-components": "off",
        },
      },
      {
        files: ["packages/m3e/src/components/**"],
        rules: {
          "jsx-a11y/prefer-tag-over-role": "off",
        },
      },
      {
        files: ["packages/m3e/src/components/expressive-carousel.tsx"],
        rules: {
          "jsx-a11y/no-noninteractive-tabindex": "off",
          "jsx-a11y/no-noninteractive-element-interactions": "off",
        },
      },
      {
        files: ["packages/m3e/src/components/input-group.tsx"],
        rules: {
          "jsx-a11y/click-events-have-key-events": "off",
          "jsx-a11y/no-noninteractive-element-interactions": "off",
        },
      },
      {
        files: ["packages/m3e/src/components/label.tsx"],
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
})
