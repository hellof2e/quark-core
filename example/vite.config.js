import { defineConfig } from 'vite'
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
				find: "quarkc",
				replacement: resolve(__dirname, "../packages/quark-core/src/index.ts"),
			},
		],
	},
  plugins: [
    reloadOnChange(['./src/**/*.css']),
  ],
})
