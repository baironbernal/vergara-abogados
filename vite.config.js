import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve:{
        alias:{
          "@": "/resources/js"
        }
      },
    build: {
        manifest: true,
        outDir: 'public/build', // 👈 this is critical
        rollupOptions: {
            input: '/resources/js/app.jsx',
        },
    },
});
