@props(['styles' => null])

@php
    $navLinks = [
        ['href' => route('home'),             'label' => 'Inicio'],
        ['href' => route('about'),            'label' => 'Nosotros'],
        ['href' => route('services.index'),   'label' => 'Servicios'],
        ['href' => route('properties.index'), 'label' => 'Inmobiliaria'],
        ['href' => route('blog.index'),       'label' => 'Blog'],
        ['href' => route('contact'),          'label' => 'Contacto'],
    ];
@endphp

<div
    x-data="{ open: false }"
    x-effect="document.body.style.overflow = open ? 'hidden' : ''"
    @keydown.escape.window="open = false"
    class="fixed z-10 w-full font-bold shadow-md {{ $styles }}"
>
    <div class="container px-4 mx-auto">
        <div class="flex items-center justify-between">
            {{-- Logo --}}
            <div class="flex-shrink-0">
                <a href="{{ route('home') }}" wire:navigate>
                    <img src="/logo.webp" alt="Brand Vergara y Asociados" class="w-auto h-16 md:h-20 lg:h-24">
                </a>
            </div>

            {{-- Desktop Navigation --}}
            <nav class="items-center hidden gap-6 font-semibold lg:flex xl:gap-8">
                @foreach ($navLinks as $link)
                    <a href="{{ $link['href'] }}" wire:navigate
                       class="font-medium transition-colors duration-300 hover:text-golden">
                        {{ $link['label'] }}
                    </a>
                @endforeach
            </nav>

            {{-- Reserve button (desktop) --}}
            <x-shared.main-button :href="route('contact')" class="py-2 hidden lg:block lg:py-3">
                Reserva tu consulta
            </x-shared.main-button>

            {{-- Mobile menu toggle --}}
            <div class="flex items-center lg:hidden">
                <button @click="open = !open" class="text-greyki hover:text-golden focus:outline-none" aria-label="Toggle menu">
                    <svg x-show="!open" class="w-8 h-8 lg:w-10 lg:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7"/></svg>
                    <svg x-show="open" x-cloak class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
        </div>
    </div>

    {{-- Mobile menu --}}
    <template x-teleport="body">
        <div x-show="open" x-cloak>
            {{-- Backdrop --}}
            <div x-show="open" x-transition.opacity.duration.300ms
                 @click="open = false"
                 class="fixed inset-0 z-40 bg-black/50 lg:hidden"></div>

            {{-- Panel --}}
            <div x-show="open"
                 x-transition:enter="transition ease-out duration-300"
                 x-transition:enter-start="translate-x-full"
                 x-transition:enter-end="translate-x-0"
                 x-transition:leave="transition ease-in duration-200"
                 x-transition:leave-start="translate-x-0"
                 x-transition:leave-end="translate-x-full"
                 class="fixed top-0 right-0 z-50 w-full h-full max-w-sm shadow-2xl bg-darki lg:hidden">
                <div class="flex items-center justify-between p-6 border-b border-golden/20">
                    <div class="flex items-center space-x-3">
                        <img src="/logo.webp" alt="Brand Vergara y Asociados" class="w-10 h-10">
                        <span class="text-lg font-bold text-white font-prata">Menú</span>
                    </div>
                    <button @click="open = false" class="p-2 text-white transition-colors duration-300 hover:text-golden focus:outline-none" aria-label="Close menu">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>

                <nav class="flex flex-col px-6 py-8 space-y-6">
                    @foreach ($navLinks as $link)
                        <a href="{{ $link['href'] }}" wire:navigate @click="open = false"
                           class="block text-xl font-medium text-white transition-all duration-300 hover:text-golden hover:translate-x-2 font-prata">
                            {{ $link['label'] }}
                        </a>
                    @endforeach

                    <div class="pt-8 mt-8 border-t border-golden/20">
                        <x-shared.main-button :href="route('contact')" class="w-full justify-center" x-on:click="open = false">
                            Reserva tu consulta
                        </x-shared.main-button>
                    </div>
                </nav>
            </div>
        </div>
    </template>
</div>
