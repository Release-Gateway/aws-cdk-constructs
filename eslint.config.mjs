import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import globals from "globals";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load Prettier config to sync max-len with printWidth
const prettierRc = JSON.parse(
    readFileSync(join(__dirname, ".prettierrc"), "utf-8")
);

export default [
    {
        ignores: [
            "dist/**",
            "**/*.d.ts",
            "**/*.generated.ts",
            "**/*.js",
            "!eslint.config.js",
        ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        languageOptions: {
            ecmaVersion: 12,
            sourceType: "module",
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            ...prettierConfig.rules,
            "prettier/prettier": "error",
            "@typescript-eslint/no-empty-object-type": "off",
            "max-len": [
                "warn",
                {
                    code: prettierRc.printWidth,
                    tabWidth: prettierRc.tabWidth,
                    comments: prettierRc.printWidth,
                    ignoreComments: false,
                    ignoreTrailingComments: true,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true,
                },
            ],
        },
    },
    {
        files: ["**/*.test.ts", "**/*.spec.ts"],
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
    },
];
