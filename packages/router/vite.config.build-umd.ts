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
      entry: "./src/index.ts",
      formats: ['umd'],
      fileName: (format, entryName) => {
        return `${entryName}.${format}.js`;
      },
      name: 'quarkRouter'
    },
    rollupOptions: {
      external: [
        '@babel/runtime',
        'quarkc',
      ],
      output: {
        dir: "umd",
        globals: {
          quarkc: 'Quarkc',
        },
      },
      plugins: [
      ],
    },
  },
});
