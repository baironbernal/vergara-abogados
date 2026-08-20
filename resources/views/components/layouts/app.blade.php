@props(['headerStyles' => 'bg-darki text-white/80'])

{{-- corporativeInfo and latestBlogs are injected by the View Composer (AppServiceProvider). --}}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- SEO meta (server-rendered via SeoManager) --}}
    <title>{{ \App\Services\SeoManager::title() }}</title>
    <meta name="description" content="{{ \App\Services\SeoManager::description() }}">
    @if (\App\Services\SeoManager::keywords())
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

    {{-- Canonical --}}
    <link rel="canonical" href="{{ \App\Services\SeoManager::canonical() }}">

    {{-- Geographic targeting --}}
    <meta name="geo.region" content="CO-CUN">
    <meta name="geo.placename" content="Soacha, Cundinamarca, Colombia">
    <meta name="geo.position" content="4.5790;-74.2172">
    <meta name="ICBM" content="4.5790, -74.2172">

    {{-- Structured data --}}
    <x-shared.json-ld />

    {{-- Favicon --}}
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" href="/logo.png">

    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
</head>
<body class="font-sans text-sm md:text-base">
    <x-shared.header :styles="$headerStyles" :corporativeInfo="$corporativeInfo ?? null" />

    <main class="mt-[7rem] md:mt-[8.5rem] lg:mt-[var(--header-total-height)]">
        {{ $slot }}
    </main>

    <x-shared.footer :latestBlogs="$latestBlogs ?? []" :corporativeInfo="$corporativeInfo ?? null" />
    <x-shared.whatsapp-button :corporativeInfo="$corporativeInfo ?? null" />

    @livewireScripts
</body>
</html>
