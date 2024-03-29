import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts'; // 自动生成 .d.ts 类型声明文件

export default defineConfig({
  plugins: [
    dts({
      outDir: 'lib',
    }),
  ],
  build: {
    lib: {
      entry: [
        "./src/index.ts",
        "./src/router.ts",
        "./src/routes.ts",
        "./src/quark-link.tsx",
      ],
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        '@babel/runtime',
        'quarkc',
      ],
      output: {
        dir: "lib",
        globals: {
          quarkc: 'Quarkc',
        },
      },
      plugins: [
      ],
    },
  },
});
