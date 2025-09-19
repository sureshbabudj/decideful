import { defineConfig, globalIgnores } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    "node_modules/*",
    "public",
    ".next",
    "out",
    "coverage",
    "cypress",
    "scripts",
    "eslint.config.mjs",
    "postcss.config.mjs",
    "tailwind.config.mjs",
    "next-env.d.ts",
    "*.config.js",
    "*.config.cjs",
    "*.config.mjs",
    "jest.setup.ts",
    "turbo.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "package-lock.json",
    "dist",
    "*.d.ts",
  ]),
  {
    extends: compat.extends("next/core-web-vitals", "next/typescript"),
    rules: {
      // off error when error is updated with any in catch block
      "@typescript-eslint/use-unknown-in-catch-callback-variable": "warn",
    },
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        useUnknownInCatchVariables: false,
      },
    },
  },
]);
