module.exports = {
  "env": {
      "es6": true,
      "mocha": true
  },
  "extends": [
      'eslint:recommended',
      "airbnb-base",
      "prettier", // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  "rules": {
      "import/extensions": [
          "error",
          "ignorePackages",
          {
            "js": "never",
            "ts": "never"
          }
      ],
      "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*.js"]}],
      "no-undef": 2,
  },
}
