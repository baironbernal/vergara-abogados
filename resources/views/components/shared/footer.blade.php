@props(['latestBlogs' => [], 'corporativeInfo' => null])

@php
    $facebook  = $corporativeInfo?->corporative_facebook;
    $twitter   = $corporativeInfo?->corporative_twitter;
    $instagram = $corporativeInfo?->corporative_instagram;
    $linkedin  = $corporativeInfo?->corporative_linkedin;
    $email     = $corporativeInfo?->corporative_email    ?? 'contact@company.com';
    $phone     = $corporativeInfo?->corporative_whatsapp  ?? '+1 (555) 123-4567';
    $address   = $corporativeInfo?->office_address ?? "Cl. 12 #8 05,\nSoacha Cundinamarca";
    $copyright = $corporativeInfo?->copyright_text ?? '© ' . date('Y') . ' Inmobiliaria Vergara y Abogados. Todos los derechos reservados.';
@endphp

<footer class="py-8 tracking-normal text-white bg-darki lg:py-12">
    <div class="px-4 mx-auto max-w-7xl lg:px-8">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {{-- About --}}
            <div class="flex flex-col justify-start text-left">
                <h3 class="mb-4 text-base font-bold tracking-tight text-left font-prata lg:text-lg">Acerca de</h3>
                <p class="mb-4 text-sm leading-relaxed text-left text-graykiSecondary">
                    Somos una empresa líder dedicada a brindar servicios excepcionales y soluciones innovadoras a nuestros clientes en todo el mundo.
                </p>
                <div class="flex justify-start space-x-4">
                    @if ($facebook)
                        <a href="{{ $facebook }}" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg class="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg></a>
                    @endif
                    @if ($twitter)
                        <a href="{{ $twitter }}" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><svg class="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg></a>
                    @endif
                    @if ($instagram)
                        <a href="{{ $instagram }}" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg class="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
                    @endif
                    @if ($linkedin)
                        <a href="{{ $linkedin }}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg class="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S.02 4.881.02 3.5C.02 2.12 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8h4.52v14H.24V8zm7.5 0h4.33v1.91h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V22h-4.52v-6.72c0-1.6-.03-3.66-2.23-3.66-2.23 0-2.57 1.74-2.57 3.54V22H7.74V8z"/></svg></a>
                    @endif
                </div>
            </div>

            {{-- Latest blog posts --}}
            <div class="text-left">
                <h3 class="mb-4 text-base font-bold tracking-tight text-left font-prata lg:text-lg">Últimos Artículos</h3>
                @if (count($latestBlogs) > 0)
                    <ul class="space-y-2 text-left md:space-y-3">
                        @foreach ($latestBlogs as $blog)
                            <li class="text-left">
                                <a href="{{ route('blog.show', $blog->slug) }}" wire:navigate class="block text-left group">
                                    <div class="flex items-start justify-start space-x-2 lg:space-x-3">
                                        <svg class="w-3 h-3 mt-0.5 text-graykiSecondary group-hover:text-golden transition-colors flex-shrink-0 lg:w-4 lg:h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                        <div class="flex-1 min-w-0 text-left">
                                            <p class="text-xs text-left transition-colors text-graykiSecondary group-hover:text-white line-clamp-2 lg:text-sm">
                                                {{ $blog->title }}
                                            </p>
                                            <div class="flex items-center justify-start mt-1 text-xs text-gray-400">
                                                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                @if ($blog->published_at) {{ $blog->published_at->locale('es')->translatedFormat('d M') }} @endif
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        @endforeach
                    </ul>
                    <div class="mt-4 text-left">
                        <a href="{{ route('blog.index') }}" wire:navigate class="inline-flex items-center text-xs text-left transition-colors text-golden hover:text-white lg:text-sm">
                            <svg class="w-3 h-3 mr-1 lg:w-4 lg:h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                            Ver todos los artículos
                        </a>
                    </div>
                @else
                    <div class="text-xs text-left text-graykiSecondary lg:text-sm">
                        <p class="text-left">No hay artículos disponibles.</p>
                        <a href="{{ route('blog.index') }}" wire:navigate class="inline-flex items-center mt-2 text-xs text-left transition-colors text-golden hover:text-white lg:text-sm">
                            <svg class="w-3 h-3 mr-1 lg:w-4 lg:h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                            Ver blog
                        </a>
                    </div>
                @endif
            </div>

            {{-- Contact info --}}
            <div class="text-left">
                <h3 class="mb-4 text-base font-bold tracking-tight text-left font-prata lg:text-lg">Información de Contacto</h3>
                <article class="flex flex-col space-y-2 text-left md:space-y-3">
                    <div class="flex items-start justify-start space-x-2 lg:space-x-3">
                        <svg class="w-4 h-4 text-graykiSecondary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        <span class="text-xs text-left text-graykiSecondary lg:text-sm whitespace-pre-line">{{ $address }}</span>
                    </div>
                    <div class="flex items-center justify-start space-x-2 lg:space-x-3">
                        <svg class="flex-shrink-0 w-4 h-4 text-graykiSecondary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        <span class="text-xs text-left text-graykiSecondary lg:text-sm">{{ $phone }}</span>
                    </div>
                    <div class="flex items-center justify-start space-x-2 lg:space-x-3">
                        <svg class="flex-shrink-0 w-4 h-4 text-graykiSecondary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        <span class="text-xs text-left text-graykiSecondary lg:text-sm">{{ $email }}</span>
                    </div>
                </article>
            </div>

            {{-- Quick links --}}
            <div class="text-left">
                <h3 class="mb-4 text-base font-bold tracking-tight text-left font-prata lg:text-lg">Enlaces Rápidos</h3>
                <ul class="space-y-2 text-left">
                    <li><a href="{{ route('home') }}" wire:navigate class="text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm">Inicio</a></li>
                    <li><a href="{{ route('about') }}" wire:navigate class="text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm">Nosotros</a></li>
                    <li><a href="{{ route('services.index') }}" wire:navigate class="text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm">Servicios</a></li>
                    <li><a href="{{ route('properties.index') }}" wire:navigate class="text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm">Propiedades</a></li>
                    <li><a href="{{ route('blog.index') }}" wire:navigate class="text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm">Blog</a></li>
                    <li><a href="{{ route('contact') }}" wire:navigate class="text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm">Contacto</a></li>
                </ul>
            </div>
        </div>

        {{-- Copyright --}}
        <div class="pt-8 mt-8 border-t border-gray-700">
            <div class="flex flex-col items-start justify-between gap-4 text-left md:flex-row">
                <p class="text-xs text-left text-graykiSecondary lg:text-sm">{{ $copyright }}</p>
                <div class="flex space-x-4 text-xs text-left text-graykiSecondary lg:text-sm">
                    <a href="/privacy" class="text-left hover:text-white">Política de Privacidad</a>
                    <a href="/terms" class="text-left hover:text-white">Términos de Servicio</a>
                </div>
            </div>
        </div>
    </div>
</footer>
