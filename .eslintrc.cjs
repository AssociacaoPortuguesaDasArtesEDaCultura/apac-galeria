module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    "prettier",
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  plugins: [
    "import",
    "simple-import-sort",
    "@typescript-eslint",
    "prettier",
    "no-only-tests",
    "unused-imports",
    'react-refresh'
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    "ecmaVersion": 2021,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  env: {
    "node": true
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "prettier/prettier": "warn",
    "arrow-body-style": [
      "warn",
      "as-needed"
    ],
    "no-console": "warn",
    "eqeqeq": [
      "error",
      "always"
    ],
    "unused-imports/no-unused-imports": "error",
    "import/no-commonjs": "error",
    "import/no-duplicates": "warn",
    "simple-import-sort/imports": [
      "warn",
      {
        "groups": [
          [
            // SCSS and css file imports
            "\\.s?css$",
            // Side effect (e.g. `import "./foo"`)
            "^\\u0000",
            // Every import starting with "react"
            "^react",
            // Things that start with a letter (or digit or underscore), or `@` followed by a letter
            "^@?\\w",
            // Internal absolute paths
            "^@/",
            // Internal relative paths
            "^\\."
          ]
        ]
      }
    ],
    "no-only-tests/no-only-tests": ["error", { "block": ["describe", "it"], "focus": ["only", "skip"] }],
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          "**/build/*",
          "**/dist/*",
          "**/app-*/*",
          "**/shared-*/*",
          "@shared/*/*"
        ]
      }
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    "quotes": "off",
    "@typescript-eslint/quotes": "error"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "overrides": [
    {
      "files": [
        "**/*.ts?(x)"
      ],
      "extends": [
        "plugin:@typescript-eslint/recommended"
      ],
      "rules": {
        "@typescript-eslint/no-explicit-any": "off"
      }
    },
    {
      "files": [
        "**/*.test.ts?(x)"
      ],
      "rules": {
        "@typescript-eslint/no-non-null-assertion": "off"
      }
    },
    {
      "files": ["config/*"],
      "env": {
        "node": true
      }
    }
  ]
}
