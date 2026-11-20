import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const geminiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || env.API_KEY || '';
    const geminiKey1 = env.GEMINI_API_KEY_1 || '';
    const geminiKey2 = env.GEMINI_API_KEY_2 || '';
    const geminiKey3 = env.GEMINI_API_KEY_3 || '';

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(geminiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(geminiKey),
        'process.env.GEMINI_API_KEY_1': JSON.stringify(geminiKey1),
        'process.env.GEMINI_API_KEY_2': JSON.stringify(geminiKey2),
        'process.env.GEMINI_API_KEY_3': JSON.stringify(geminiKey3),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        chunkSizeWarningLimit: 1000,
      }
    };
});
