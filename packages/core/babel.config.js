const presets = [["@babel/preset-env"]];
const plugins = [
  ["@babel/plugin-transform-runtime"],
  [
    "@babel/plugin-proposal-decorators",
    {
      legacy: true,
    },
  ],
];

export default { presets, plugins };
