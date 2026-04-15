<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- SEO Meta Tags (server-rendered via SeoManager) --}}
        <title>{{ \App\Services\SeoManager::title() }}</title>
        <meta name="description" content="{{ \App\Services\SeoManager::description() }}">
        @if(\App\Services\SeoManager::keywords())
        <meta name="keywords" content="{{ \App\Services\SeoManager::keywords() }}">
        @endif
        <meta name="robots" content="index, follow">
        
        {{-- Open Graph --}}
        <meta property="og:site_name" content="Inmobiliaria Vergara y Abogados">
        <meta property="og:type" content="website">
        <meta property="og:locale" content="es_CO">
        <meta property="og:title" content="{{ \App\Services\SeoManager::title() }}">
        <meta property="og:description" content="{{ \App\Services\SeoManager::description() }}">
        <meta property="og:url" content="{{ \App\Services\SeoManager::canonical() }}">
        <meta property="og:image" content="{{ asset('logo.png') }}">

        {{-- Twitter Card --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ \App\Services\SeoManager::title() }}">
        <meta name="twitter:description" content="{{ \App\Services\SeoManager::description() }}">
        <meta name="twitter:image" content="{{ asset('logo.png') }}">

        {{-- Canonical URL --}}
        <link rel="canonical" href="{{ \App\Services\SeoManager::canonical() }}">

        {{-- Geographic targeting --}}
        <meta name="geo.region" content="CO-CUN">
        <meta name="geo.placename" content="Soacha, Cundinamarca, Colombia">
        <meta name="geo.position" content="4.5790;-74.2172">
        <meta name="ICBM" content="4.5790, -74.2172">

        {{-- JSON-LD Structured Data --}}
        @php $schema = \App\Services\SeoManager::schema() @endphp
        @if($schema)
            @if(is_array($schema) && count($schema) > 1)
                @foreach($schema as $singleSchema)
                <script type="application/ld+json">{!! json_encode($singleSchema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
                @endforeach
            @else
            <script type="application/ld+json">{!! json_encode(is_array($schema) ? $schema[0] : $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
            @endif
        @endif

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="icon" type="image/png"    href="/logo.png">

        <!-- Preload Critical Fonts -->
        <link rel="preload" href="/build/assets/dm-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
        <link rel="preload" href="/build/assets/dm-sans-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
        <link rel="preload" href="/build/assets/prata-latin-400-normal.woff2"   as="font" type="font/woff2" crossorigin>

        {{-- Inertia handles client-side navigation meta updates --}}
        @inertiaHead

        @viteReactRefresh
        @vite('resources/js/app.jsx')
    </head>
    <body>
        @inertia
    </body>
</html>
