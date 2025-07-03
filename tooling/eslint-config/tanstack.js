import react from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import eslintConfigPrettier from "eslint-config-prettier";
import * as reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import { config as baseConfig } from "./base.js";

export const tanstackConfig = tseslint.config({
  ignores: ["dist", ".wrangler", ".vercel", ".netlify", ".output", "build/"],
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  extends: [
    ...baseConfig,
    js.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
    ...pluginQuery.configs["flat/recommended"],
    ...pluginRouter.configs["flat/recommended"],
    reactHooks.configs.recommended,
    react.configs["recommended-type-checked"],
    // ...you can add plugins or configs here
  ],
  rules: {
    // You can override any rules here
    "react-hooks/react-compiler": "warn",
    "@eslint-react/no-context-provider": "off",
  },
});
