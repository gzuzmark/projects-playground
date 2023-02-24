module.exports = {
  root: true,
  parserOptions: {
    project: "tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  extends: ["custom"],
  rules: {
    "@next/next/no-img-element": "off",
    "react/prop-types": "off",
  },
};
