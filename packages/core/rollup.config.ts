import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json"
import filesize from 'rollup-plugin-filesize';

const extensions = [".js", ".ts", ".tsx"];
const plugins = [
  typescript(),
  json(),
  commonjs(),
  nodeResolve({
    extensions,
    // modulesOnly: true,
  }),
  babel({
    babelHelpers: "runtime",
    exclude: "node_modules/**",
    extensions,
  }),
  terser(),
  filesize(),
];
const input = "./src/index.ts";
const dir = "lib";
export default defineConfig([
  {
    input,
    output: [
      {
        dir,
        entryFileNames: 'index.js',
        format: "es",
      },
    ],
    plugins,
    external: /@babel\/runtime/,
  },
  {
    input,
    output: [
      {
        dir,
        entryFileNames: "index.umd.js",
        format: "umd",
        name: 'Quarkc',
      },
    ],
    plugins,
  },
]);
