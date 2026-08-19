import {defineConfig} from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@libretext/core': path.resolve(__dirname, 'packages/core/src'),
      '@libretext/core/*': path.resolve(__dirname, 'packages/core/src/*'),
    },
  },
  test: {
    globals: true,
    include: ['packages/*/tests/**/*.test.ts'],
    projects: [
      {
        test: {
          name: 'node',
          globals: true,
          environment: 'node',
          include: ['packages/{core,serializers,plugins}/tests/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'jsdom',
          globals: true,
          environment: 'jsdom',
          include: ['packages/adapters/tests/**/*.test.ts'],
        },
      },
    ],
  },
});
