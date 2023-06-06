import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

const extensions = [".js", ".ts", ".tsx"];

/**
 * @type {import('rollup').RollupOptions}
 */
const options = [
  {
    input: "./src/index.ts",
    output: {
      dir: "lib",
      chunkFileNames: "[name].js",
      format: "es",
    },
    treeshake: true,
    plugins: [
      typescript(),
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
  }
];

export default options;
