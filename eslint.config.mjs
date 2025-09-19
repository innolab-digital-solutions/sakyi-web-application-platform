import { FlatCompat } from "@eslint/eslintrc";
import noCommentedCode from "eslint-plugin-no-commented-code";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Import sorting
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  // Comment hygiene & console cleanup
  {
    plugins: {
      "no-commented-code": noCommentedCode,
    },
    rules: {
      // Disallow leftover console.log; allow warn/error only
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Only allow approved comment tags
      "no-warning-comments": [
        "warn",
        {
          terms: ["TODO", "FIXME", "NOTE", "HACK", "REVIEW", "WARNING"],
          location: "start",
        },
      ],

      // Disallow commented-out code blocks
      "no-commented-code/no-commented-code": "error",
    },
  },

  ...compat.extends("plugin:prettier/recommended"),
];
export default eslintConfig;
