module.exports = {
  root: true,
  extends: ["@react-native"],
  ignorePatterns: ["android/", "dist/", "node_modules/"],
  rules: {
    quotes: "off",
    "react/no-unstable-nested-components": "off",
  },
};
