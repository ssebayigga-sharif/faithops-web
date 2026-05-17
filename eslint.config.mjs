import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  globalIgnores([
    ".next/**",
    "dist/**",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
