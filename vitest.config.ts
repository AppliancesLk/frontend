import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'test/e2e'],
    coverage: {
  provider: 'v8',

  reporter: ['text', 'html', 'lcov'],

  include: [
    'src/**/*.{ts,tsx}',
  ],

  exclude: [
    'src/**/*.test.{ts,tsx}',
    'src/**/*.spec.{ts,tsx}',
    'src/test/**',

    'src/**/*.d.ts',
    'src/**/types/**',
    'src/**/constants/**',

    'src/main.tsx',
    'src/vite-env.d.ts',

    '**/node_modules/**',
    '**/dist/**',
  ],
},
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
