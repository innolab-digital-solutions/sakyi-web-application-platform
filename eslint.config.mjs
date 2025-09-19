import { FlatCompat } from "@eslint/eslintrc";
import noCommentedCode from "eslint-plugin-no-commented-code";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unicorn from "eslint-plugin-unicorn";
import security from "eslint-plugin-security";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Core Next.js ESLint configurations for optimal performance and TypeScript support
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Security hardening - prevents common security vulnerabilities
  security.configs.recommended,

  // Code quality and modern JavaScript best practices enforcement
  unicorn.configs.recommended,

  // Automatic import organization and consistent sorting
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  // Development hygiene and debugging cleanup rules
  {
    plugins: {
      "no-commented-code": noCommentedCode,
    },
    rules: {
      // Prevent accidental console.log statements in production; allow warn/error for legitimate logging
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Enforce structured comment conventions for better code documentation
      "no-warning-comments": [
        "warn",
        {
          terms: ["TODO", "FIXME", "NOTE", "HACK", "REVIEW", "WARNING"],
          location: "start",
        },
      ],

      // Prevent committed commented-out code that clutters the codebase
      "no-commented-code/no-commented-code": "error",
    },
  },

  // Prettier integration for consistent code formatting
  ...compat.extends("plugin:prettier/recommended"),
];
export default eslintConfig;
