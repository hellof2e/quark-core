import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json"
import filesize from 'rollup-plugin-filesize';
import replace from '@rollup/plugin-replace';

const extensions = [".js", ".ts", ".tsx"];
const commonPlugins = [
  typescript({ exclude: ['test/**', 'rollup.config.ts'] }),
  json(),
  commonjs(),
  nodeResolve({
    extensions,
  }),
  babel({
    babelHelpers: "runtime",
    exclude: "node_modules/**",
    extensions,
  }),
  filesize(),
];
const getPlugins = ({
  isProd,
  isBrowserOnly,
}: {
  /** 是否为生产包 */
  isProd?: boolean;
  /** 是否仅能用在浏览器环境中 */
  isBrowserOnly?: boolean;
} = {}) => {
  const plugins = commonPlugins.slice();

  if (isBrowserOnly) {
    plugins.push(replace({
      preventAssignment: true,
      'process.env.NODE_ENV': `'${isProd ? 'production': 'development'}'`,
    }));
  }
  
  if (isProd) {
    return [
      ...plugins,
      terser(),
    ];
  }

  return plugins;
};
const input = "./src/main.ts";
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
    plugins: getPlugins(),
    external: /@babel\/runtime/,
  },
  {
    input,
    output: [
      {
        dir,
        entryFileNames: 'index.browser.js',
        format: "es",
      },
    ],
    plugins: getPlugins({ isBrowserOnly: true }),
  },
  {
    input,
    output: [
      {
        dir,
        entryFileNames: 'index.browser.prod.js',
        format: "es",
      },
    ],
    plugins: getPlugins({ isBrowserOnly: true, isProd: true }),
  },
  {
    input,
    output: [
      {
        dir,
        entryFileNames: 'index.umd.js',
        format: 'umd',
        name: 'Quarkc',
      },
    ],
    plugins: getPlugins({ isBrowserOnly: true }),
  },
  {
    input,
    output: [
      {
        dir,
        entryFileNames: 'index.umd.prod.js',
        format: 'umd',
        name: 'Quarkc',
      },
    ],
    plugins: getPlugins({ isBrowserOnly: true, isProd: true }),
  },
]);
