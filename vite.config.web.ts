import { defineConfig } from 'vite';
import BaseConfig from './vite.config';

export default defineConfig({
  ...BaseConfig,
  define: {
    '__IS_TAURI__': false,
  },
});
