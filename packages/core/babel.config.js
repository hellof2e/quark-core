const presets = [["@babel/preset-env"]];
const plugins = [
  ["@babel/plugin-transform-runtime"],
  ["@babel/plugin-proposal-decorators", { "version": "legacy" }],
];

export default { presets, plugins };
