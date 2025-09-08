<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        
        <!-- SEO Meta Tags -->
        @if(isset($page['props']['seo']))
            <title>{{ $page['props']['seo']['title'] }}</title>
            @if(isset($page['props']['seo']['canonical']))
                <link rel="canonical" href="{{ $page['props']['seo']['canonical'] }}">
            @endif
            @if(isset($page['props']['seo']['meta']))
                @foreach($page['props']['seo']['meta'] as $meta)
                    @if(isset($meta['name']))
                        <meta name="{{ $meta['name'] }}" content="{{ $meta['content'] }}">
                    @elseif(isset($meta['property']))
                        <meta property="{{ $meta['property'] }}" content="{{ $meta['content'] }}">
                    @endif
                @endforeach
            @endif
        @else
            <title>Inmobiliaria & Abogados Vergara</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="description" content="Inmobiliaria Vergara ofrece servicios integrales de bienes raíces y asesoría legal especializada. Propiedades en venta, alquiler y servicios jurídicos inmobiliarios en Colombia.">
            <meta name="keywords" content="inmobiliaria, bienes raíces, propiedades, venta, alquiler, derecho inmobiliario, asesoría legal, Colombia">
        @endif
        
        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="icon" type="image/png" href="/logo.png">
        
        <!-- Preload Critical Fonts -->
        <link rel="preload" href="/build/assets/dm-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
        <link rel="preload" href="/build/assets/dm-sans-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
        <link rel="preload" href="/build/assets/prata-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
        
        <!-- Structured Data -->
        @if(isset($page['props']['seo']['structured_data']))
            <script type="application/ld+json">
                {!! json_encode($page['props']['seo']['structured_data'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
            </script>
        @endif

        <!-- Styles / Scripts -->
        @viteReactRefresh
        @vite('resources/js/app.jsx')
        @inertiaHead
    </head>
    <body >
       @inertia
    </body>
</html>
