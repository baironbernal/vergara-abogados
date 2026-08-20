import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            // Blade + Livewire only. Livewire ships its own runtime and Alpine
            // via @livewireScripts, so app.js carries almost nothing.
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
});
