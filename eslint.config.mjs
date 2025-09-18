import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import prettierPlugin from "eslint-plugin-prettier";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import eslintComments from "eslint-plugin-eslint-comments";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      prettier: prettierPlugin,
      "unused-imports": unusedImportsPlugin,
      import: importPlugin,
      "simple-import-sort": simpleImportSortPlugin,
      "eslint-comments": eslintComments,
    },
    rules: {
      // Prettier integration
      "prettier/prettier": "error",

      // Cleanup unused imports/variables
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      ],

      // Auto sort imports/exports
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // Allow only structured comments
      "spaced-comment": [
        "error",
        "always",
      ],
      "eslint-comments/no-unused-disable": "error",
      "eslint-comments/no-unlimited-disable": "error",

      "react/no-children-prop": "off",
    },
  },
];

export default eslintConfig;
