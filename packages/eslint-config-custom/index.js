module.exports = {
  extends: ["next", "turbo", "wesbos/typescript"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
  },
};
