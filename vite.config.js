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
    chunkSizeWarningLimit: 1000, // KB - our main bundle is ~779 KB
    rollupOptions: {
      output: {
        entryFileNames: 'static/js/[name].[hash].js',
        chunkFileNames: 'static/js/[name].[hash].chunk.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'static/css/[name].[hash][extname]';
          }
          return 'static/media/[name].[hash][extname]';
        },
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Material UI (large) - includes emotion as peer dep
          'vendor-mui': ['@mui/material', '@mui/icons-material'],
          // Rich text editor
          'vendor-tiptap': ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-link'],
          // Error tracking
          'vendor-sentry': ['@sentry/react'],
          // UI primitives
          'vendor-radix': ['@radix-ui/react-dialog', '@radix-ui/react-tooltip', '@radix-ui/react-accordion'],
          // Note: emotion and styled-components left out - splitting them causes runtime errors
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
