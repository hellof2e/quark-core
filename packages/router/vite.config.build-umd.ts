import { defineConfig } from 'vite';


export default defineConfig({
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
