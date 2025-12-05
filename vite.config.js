import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [
    // Custom plugin to handle JSX in .js files (CRA compatibility)
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null;
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        });
      },
    },
    react(),
    svgr()
  ],

  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },

  // Development server settings
  server: {
    port: 3000,
    open: true
  },

  // Build settings
  build: {
    outDir: 'build',
    // Disable content hashing for sourcemap compatibility (matching CRA config)
    rollupOptions: {
      output: {
        entryFileNames: 'static/js/[name].js',
        chunkFileNames: 'static/js/[name].chunk.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'static/css/[name][extname]';
          }
          return 'static/media/[name][extname]';
        }
      }
    },
    sourcemap: process.env.GENERATE_SOURCEMAP !== 'false'
  },

  // Resolve settings
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  // Define global constants (replaces process.env)
  define: {
    // For libraries that check process.env.NODE_ENV
    'process.env.NODE_ENV': JSON.stringify(mode)
  },

  // Test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: [
      'test/**/*.{spec,test}.{js,jsx,ts,tsx}',
      'src/**/__tests__/**/*.{js,jsx,ts,tsx}',
      'src/**/*.{spec,test}.{js,jsx,ts,tsx}'
    ]
  }
}));
