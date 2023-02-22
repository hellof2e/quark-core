import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from "@vitejs/plugin-react";
import { resolve }from 'path'

// https://vitejs.dev/config/
const rootPtah = resolve(__dirname, "../");
export default defineConfig({
  rootPtah,
  base: "./",
	server: {
		port: 2023,
		host: "0.0.0.0",
	},
  resolve: {
		alias: [
			{ find: "@", replacement: resolve(__dirname, "./src") },
			{
				find: "@quarkc",
				replacement: resolve(__dirname, "../packages/quark-core/src/index.ts"),
			},
		],
	},
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("quark-"),
        },
      },
    }),
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
  ]
  ,
})
