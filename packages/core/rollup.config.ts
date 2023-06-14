import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json"

const extensions = [".js", ".ts", ".tsx"];
export default defineConfig({
  input: "./src/index.ts",
  output: [
    {
      dir: "lib",
      entryFileNames: 'index.js',
      format: "es",
    },
    {
      dir: "lib",
      entryFileNames: "index.umd.js",
      format: "umd",
      name: 'Quarkc',
    },
  ],
  treeshake: true,
  plugins: [
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
  ],
});
