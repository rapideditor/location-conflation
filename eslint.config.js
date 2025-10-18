import js from '@eslint/js';

const common = {
  rules: {
    "dot-notation": "error",
    "eqeqeq": ["error", "smart"],
    "keyword-spacing": "error",
    "linebreak-style": ["error", "unix"],
    "no-caller": "error",
    "no-catch-shadow": "error",
    "no-console": "warn",
    "no-div-regex": "error",
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-floating-decimal": "error",
    "no-implied-eval": "error",
    "no-invalid-this": "error",
    "no-iterator": "error",
    "no-labels": "error",
    "no-label-var": "error",
    "no-lone-blocks": "error",
    "no-loop-func": "error",
    "no-multi-str": "error",
    "no-native-reassign": "error",
    "no-new": "error",
    "no-new-func": "error",
    "no-new-wrappers": "error",
    "no-octal": "error",
    "no-octal-escape": "error",
    "no-process-env": "error",
    "no-proto": "error",
    "no-prototype-builtins": "off",
    "no-return-assign": "off",
    "no-script-url": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-shadow": "off",
    "no-shadow-restricted-names": "error",
    "no-throw-literal": "error",
    "no-unneeded-ternary": "error",
    "no-unused-expressions": "error",
    "no-unexpected-multiline": "error",
    "no-unused-vars": ["warn", { "vars": "all", "args": "none", "caughtErrors": "none" }],
    "no-void": "error",
    "no-warning-comments": "warn",
    "no-with": "error",
    "no-use-before-define": ["off", "nofunc"],
    "semi": ["error", "always"],
    "semi-spacing": "error",
    "space-unary-ops": "error",
    "wrap-regex": "off"
  }
};


export default [
  js.configs.recommended,
  common,
  {
    languageOptions: {
      globals: {
        Bun: false
      }
    }
  }
];
