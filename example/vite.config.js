import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from "@vitejs/plugin-react";
import { resolve }from 'path'
import reloadOnChange from 'vite-plugin-full-reload'

// https://vitejs.dev/config/
const rootPtah = resolve(__dirname, "../");
export default defineConfig({
  rootPtah,
  base: "./",
	server: {
		port: 2023,
	},
  resolve: {
		alias: [
			{
				find: "@quarkc",
				replacement: resolve(__dirname, "../packages/quark-core/src/index.ts"),
			},
		],
	},
  plugins: [
    reloadOnChange(['./src/**/*']),
    // vue({
    //   template: {
    //     compilerOptions: {
    //       isCustomElement: (tag) => tag.startsWith("quark-"),
    //     },
    //   },
    // }),
    // preact({
    //   jsxRuntime: "classic",
    //   babel: {
    //     // presets: [['@babel/preset-env'], ['@babel/preset-typescript']],
    //     plugins: [
    //       [
    //         "@babel/plugin-proposal-decorators",
    //         {
    //           legacy: true,
    //         },
    //       ],
    //       "@babel/plugin-proposal-class-properties",
    //     ],
    //   },
    // })
    react({
      jsxRuntime: "classic",
      babel: {
        // presets: [['@babel/preset-env'], ['@babel/preset-typescript']],
        plugins: [
          [
            "@babel/plugin-proposal-decorators",
            {
              legacy: true,
            },
          ],
          "@babel/plugin-proposal-class-properties",
        ],
      },
    }),
  ],
  optimizeDeps: {
    include: ['preact/devtools', 'preact/debug', 'preact/jsx-dev-runtime'],
  },
})
