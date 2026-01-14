import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import pluginVueA11y from "eslint-plugin-vuejs-accessibility";

// Fix for the whitespace bug in the globals package
const cleanBrowserGlobals = Object.fromEntries(
  Object.entries(globals.browser).map(([key, value]) => [key.trim(), value])
);

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,vue}"], 
    plugins: { js }, 
    // Use the cleaned globals here
    languageOptions: { globals: cleanBrowserGlobals } 
  },
  
  ...pluginVue.configs["flat/essential"],
  ...pluginVueA11y.configs["flat/recommended"],

  {
    rules: {
      // your custom rules
    }
  }
]);