import { defineConfig } from 'vite'
import { resolve }from 'path'

// https://vitejs.dev/config/
const rootPtah = resolve(__dirname, "../");
export default defineConfig({
  rootPtah,
  base: "./",
  resolve: {
		alias: [
			{
				find: "quarkc",
				replacement: resolve(__dirname, "../packages/core/src/index.ts"),
			},
			{
				find: "quark-router",
				replacement: resolve(__dirname, "../packages/router/src/index.ts"),
			},
		],
	},
})
