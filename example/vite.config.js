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
				replacement: resolve(__dirname, "../packages/quark-core/src/index.ts"),
			},
		],
	},
})
