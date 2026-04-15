<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Server Side Rendering
    |--------------------------------------------------------------------------
    |
    | Enable SSR so the initial HTML page contains fully-rendered content.
    | This is what makes Google index your meta tags and body text correctly.
    |
    | To start the SSR server locally: php artisan inertia:start-ssr
    | In production: use Supervisor pointing to "node bootstrap/ssr/ssr.js"
    |
    */

    /*
    | SSR is disabled — shared hosting plan does not support Node.js processes.
    | Meta tags, JSON-LD, and Open Graph are injected server-side from PHP
    | via App\Services\SeoManager in the blade template instead.
    |
    | To enable SSR in the future (VPS / cloud): set INERTIA_SSR_ENABLED=true
    | in .env and run "php artisan inertia:start-ssr" as a supervised process.
    */
    'ssr' => [
        'enabled' => env('INERTIA_SSR_ENABLED', false),
        'url'     => env('INERTIA_SSR_URL', 'http://127.0.0.1:13714'),
    ],

    'testing' => [
        'ensure_pages_exist' => true,
        'page_paths' => [
            resource_path('js/Pages'),
        ],
        'page_extensions' => [
            'jsx',
        ],
    ],

];
