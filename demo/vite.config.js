import { defineConfig } from 'vite'
import { resolve }from 'path'
import inspector from 'vite-plugin-dev-inspector'

// https://vitejs.dev/config/
const rootPtah = resolve(__dirname, "../");
export default defineConfig({
  rootPtah,
  base: "./",
  plugins: [
    inspector({
      toggleButtonVisibility: 'never'
    }),
  ],
  resolve: {
		alias: [
			{
				find: "quarkc",
				replacement: resolve(__dirname, "../packages/core/src/main.ts"),
			},
			{
				find: "quark-router",
				replacement: resolve(__dirname, "../packages/router/src/index.ts"),
			},
		],
	},
})
