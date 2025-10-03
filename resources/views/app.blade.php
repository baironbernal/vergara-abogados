<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="icon" type="image/png" href="/logo.png">

        <!-- Preload Critical Fonts -->
        <link rel="preload" href="/build/assets/dm-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
        <link rel="preload" href="/build/assets/dm-sans-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
        <link rel="preload" href="/build/assets/prata-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>

        <!-- Styles / Scripts -->
        @viteReactRefresh
        @vite('resources/js/app.jsx')
        @inertiaHead
    </head>
    <body >
       @inertia
    </body>
</html>
