import { fileURLToPath } from 'url';
import { esbuildPlugin } from '@web/dev-server-esbuild'

const tsConfigFileURL = fileURLToPath(new URL('./tsconfig.json', import.meta.url));

export default {
  files: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
  plugins: [esbuildPlugin({
    ts: true,
    tsconfig: tsConfigFileURL,
    tsx: true,
    json: true,
    define: {
      'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`
    },
  })],
};
