import path from 'path';
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(() => {
  return {
    plugins: [
      dts({
        include: ['src/**/*.ts'],
        outDir: 'dist',
        rollupTypes: true,
      }),
    ],
    resolve: {
      alias: {
        '@libretext/core': path.resolve(__dirname, './src'),
      },
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'LibreTextCore',
        formats: ['es'],
        fileName: 'index',
      },
      rollupOptions: {
        external: [],
        output: {
          globals: {},
        },
      },
      sourcemap: true,
      minify: false,
    },
    test: {
      globals: true,
      environment: 'node',
      include: ['tests/**/*.test.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        include: ['src/**/*.ts'],
        exclude: ['src/index.ts'],
      },
    },
  };
});
