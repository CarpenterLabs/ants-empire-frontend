import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import eslint from 'vite-plugin-eslint';
import svgrPlugin from 'vite-plugin-svgr';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import pluginChecker from 'vite-plugin-checker';
import path from 'path';

export default defineConfig({
  publicDir: 'public',
  server: {
    open: true,
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        additionalData: `
          @import "@ScssMain/_variables.scss";
          @import "@ScssMain/_mixins.scss";
          @import "@ScssMain/_functions.scss";
          @import "@ScssMain/_utilities.scss";
        `,
      },
    },
  },
  preview: {
    port: 3000,
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  build: {
    outDir: './build',
    emptyOutDir: true,
    sourcemap: false,
    commonjsOptions: {
      sourceMap: false,
    },
    rollupOptions: {
      plugins: [nodePolyfills({ sourceMap: false })],
      output: {
        sourcemap: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ComponentsRoot': path.resolve(__dirname, './src/components'),
      '@ControlPanelComponents': path.resolve(__dirname, './src/components/ControlPanel/components'),
      '@Layout': path.resolve(__dirname, './src/layout'),
      '@Public': path.resolve(__dirname, './public'),
      '@Services': path.resolve(__dirname, './src/services'),
      '@MainThemeStyles': path.resolve(__dirname, './src/theme'),
      '@MainUtils': path.resolve(__dirname, './src/utils'),
      '@ViewManager': path.resolve(__dirname, './src/components/ViewManager'),
      '@DataSource': path.resolve(__dirname, './src/data/datasource'),
      '@DataEntity': path.resolve(__dirname, './src/data/entity'),
      '@DataMappers': path.resolve(__dirname, './src/data/mappers'),
      '@ScssMain': path.resolve(__dirname, './src/styles'),
      '@Assets': path.resolve(__dirname, './src/assets'),
      '@Repositories': path.resolve(__dirname, './src/repositories'),
      '@RootPath': path.resolve(__dirname, './src')
    },
  },
  plugins: [
    react(),
    eslint(),
    pluginChecker({ typescript: true }),
    // viteTsconfigPaths(),
    svgrPlugin(),
  ],
});
