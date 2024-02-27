import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import filesize from 'rollup-plugin-filesize';
import postcss from 'rollup-plugin-postcss';

const extensions = [".js", ".ts", ".tsx"];
const plugins = [
  commonjs(),
  nodeResolve({
    extensions,
    // modulesOnly: true,
  }),
  postcss({
    modules: true,  // 启用 CSS 模块
    extensions: ['.css'],  // CSS 文件的扩展名
  }),
  typescript({
    sourceMap: true,
  }),
  babel({
    babelHelpers: "runtime",
    exclude: "node_modules/**",
    extensions,
  }),
  terser(),
  filesize(),
];
const input = [
  "./src/index.ts",
  "./src/router.ts",
  "./src/routes.ts",
  "./src/quark-link.tsx",
];
const dir = "lib";
export default defineConfig([
  {
    input,
    output: [
      {
        dir,
        format: "es",
        sourcemap: true,
      },
    ],
    plugins,
    external: /@babel\/runtime/,
  },
]);
