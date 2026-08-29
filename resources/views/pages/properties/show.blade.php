@php
    $images = collect([$property->thumbnail])
        ->merge($property->gallery ?? [])
        ->filter()
        ->map(fn ($path) => '/storage/'.$path)
        ->values();

    if ($images->isEmpty()) {
        $images = collect(['/placeholder.svg']);
    }

    $price = '$'.$property->formatted_price;
    $whatsapp = preg_replace('/\D/', '', $corporativeInfo?->corporative_whatsapp ?? '+573115327297');

    $waLink = fn (string $message) => 'https://wa.me/'.$whatsapp.'?text='.rawurlencode($message);
@endphp

<x-layouts.app>
    <div class="min-h-screen bg-whiteki"
         x-data="{
            index: 0,
            galleryOpen: false,
            count: {{ $images->count() }},
            next() { this.index = (this.index + 1) % this.count },
            prev() { this.index = (this.index - 1 + this.count) % this.count },
         }"
         @keydown.escape.window="galleryOpen = false"
         @keydown.arrow-right.window="if (galleryOpen) next()"
         @keydown.arrow-left.window="if (galleryOpen) prev()">

        {{-- Back navigation --}}
        <div class="px-4 py-4 mx-auto max-w-7xl">
            <a href="{{ route('properties.index') }}" wire:navigate
               class="inline-flex items-center transition-colors duration-200 text-greyki hover:text-golden font-dmsans">
                <x-lucide name="arrow-left" class="w-4 h-4 mr-2 lg:w-5 lg:h-5" />
                Volver a Propiedades
            </a>
        </div>

        <div class="px-4 py-6 mx-auto max-w-7xl lg:py-8">
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">

                {{-- Images --}}
                <div class="space-y-4">
                    <div class="relative">
                        @foreach ($images as $i => $image)
                            <img src="{{ $image }}" alt="{{ $property->name }}"
                                 x-show="index === {{ $i }}"
                                 @click="galleryOpen = true"
                                 @if ($i > 0) x-cloak loading="lazy" @endif
                                 class="w-full h-64 object-cover border border-softGrey cursor-pointer sm:h-80 lg:h-[500px]">
                        @endforeach

                        <button type="button" @click="galleryOpen = true"
                                class="absolute flex items-center gap-2 px-2 py-1 text-xs transition-colors duration-200 top-3 right-3 bg-darki text-whiteki font-dmsans hover:bg-golden lg:top-4 lg:right-4 lg:px-3 lg:py-2 lg:text-sm">
                            <x-lucide name="maximize" class="w-3 h-3 lg:w-4 lg:h-4" />
                            Ver Galería
                        </button>

                        @if ($images->count() > 1)
                            <button type="button" @click="prev()" aria-label="Imagen anterior"
                                    class="absolute p-1 transition-colors duration-200 transform -translate-y-1/2 left-2 top-1/2 bg-darki/80 text-whiteki hover:bg-golden lg:left-4 lg:p-2">
                                <x-lucide name="chevron-left" class="w-4 h-4 lg:w-5 lg:h-5" />
                            </button>
                            <button type="button" @click="next()" aria-label="Imagen siguiente"
                                    class="absolute p-1 transition-colors duration-200 transform -translate-y-1/2 right-2 top-1/2 bg-darki/80 text-whiteki hover:bg-golden lg:right-4 lg:p-2">
                                <x-lucide name="chevron-right" class="w-4 h-4 lg:w-5 lg:h-5" />
                            </button>
                        @endif
                    </div>

                    {{-- Thumbnails --}}
                    @if ($images->count() > 1)
                        <div class="grid grid-cols-4 gap-2">
                            @foreach ($images as $i => $image)
                                <img src="{{ $image }}" alt="{{ $property->name }} - {{ $i + 1 }}"
                                     loading="lazy"
                                     @click="index = {{ $i }}"
                                     :class="index === {{ $i }} ? 'border-golden' : 'border-softGrey hover:border-golden'"
                                     class="object-cover w-full h-16 transition-all duration-200 border-2 cursor-pointer sm:h-20 lg:h-20">
                            @endforeach
                        </div>
                    @endif
                </div>

                {{-- Property info --}}
                <div class="space-y-6 lg:space-y-8">
                    <div>
                        <div class="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <span class="px-3 py-1 text-sm font-medium bg-golden text-whiteki font-dmsans w-fit">
                                {{ $property->type_spanish }}
                            </span>
                            <span class="text-2xl font-bold text-golden font-prata sm:text-3xl">{{ $price }}</span>
                        </div>

                        <h1 class="mb-3 text-2xl font-medium text-darki font-prata sm:text-3xl lg:text-4xl">
                            {{ $property->name }}
                        </h1>

                        <div class="flex items-center mb-4 text-greyki lg:mb-6">
                            <x-lucide name="map-pin" class="flex-shrink-0 w-4 h-4 mr-2 text-golden lg:w-5 lg:h-5" />
                            <span class="text-sm font-dmsans lg:text-base">
                                {{ collect([$property->municipality?->name, $property->state?->name ?: 'Colombia'])->filter()->implode(', ') }}
                            </span>
                        </div>
                    </div>

                    {{-- Key details --}}
                    <div class="grid grid-cols-2 gap-4 py-4 border-y border-softGrey sm:gap-6 sm:py-6">
                        @if ($property->size)
                            <div class="text-center">
                                <div class="flex items-center justify-center mb-2">
                                    <x-lucide name="home" class="w-5 h-5 text-golden lg:w-6 lg:h-6" />
                                </div>
                                <div class="text-xl font-bold text-darki font-prata lg:text-2xl">{{ $property->size }}</div>
                                <div class="text-xs text-greyki font-dmsans lg:text-sm">m² construidos</div>
                            </div>
                        @endif

                        <div class="text-center">
                            <div class="flex items-center justify-center mb-2">
                                <x-lucide name="calendar" class="w-5 h-5 text-golden lg:w-6 lg:h-6" />
                            </div>
                            <div class="text-xl font-bold text-darki font-prata lg:text-2xl">Disponible</div>
                            <div class="text-xs text-greyki font-dmsans lg:text-sm">Para visita</div>
                        </div>
                    </div>

                    {{-- Description --}}
                    @if ($property->description)
                        <div>
                            <h2 class="mb-3 text-lg font-medium text-darki font-dmsans lg:mb-4 lg:text-xl">Descripción</h2>
                            <p class="text-sm leading-relaxed text-greyki font-dmsans lg:text-base">
                                {{ $property->description }}
                            </p>
                        </div>
                    @endif

                    {{-- Contact actions --}}
                    <div class="pt-4 space-y-4 border-t border-softGrey lg:pt-6">
                        <livewire:visit-form :property="$property" />

                        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <a href="{{ $waLink('¡Hola! Me interesa obtener más información sobre la propiedad "' . $property->name . '" (' . $price . '). ¿Podrían ayudarme con más detalles?') }}"
                               target="_blank" rel="noopener noreferrer"
                               class="px-4 py-2 text-sm font-medium text-center transition-all duration-300 border border-golden text-golden hover:bg-golden hover:text-whiteki font-dmsans lg:px-6 lg:py-3 lg:text-base">
                                Solicitar Información
                            </a>
                            <a href="{{ $waLink('¡Hola! Me interesa contactar con un asesor para la propiedad "' . $property->name . '" (' . $price . '). ¿Podrían ayudarme?') }}"
                               target="_blank" rel="noopener noreferrer"
                               class="px-4 py-2 text-sm font-medium text-center transition-all duration-300 border border-darki text-darki hover:bg-darki hover:text-whiteki font-dmsans lg:px-6 lg:py-3 lg:text-base">
                                Contactar Asesor
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- Full-screen gallery --}}
        <div x-show="galleryOpen" x-cloak class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
             role="dialog" aria-modal="true" aria-label="Galería de imágenes">
            <div class="relative flex items-center justify-center w-full h-full p-4">
                <button type="button" @click="galleryOpen = false" aria-label="Cerrar galería"
                        class="absolute z-10 p-2 transition-colors duration-200 top-4 right-4 bg-darki text-whiteki hover:bg-golden lg:top-6 lg:right-6 lg:p-3">
                    <x-lucide name="x" class="w-5 h-5 lg:w-6 lg:h-6" />
                </button>

                @foreach ($images as $i => $image)
                    <img src="{{ $image }}" alt="{{ $property->name }} - {{ $i + 1 }}"
                         x-show="index === {{ $i }}" x-cloak
                         class="object-contain max-w-full max-h-full">
                @endforeach

                @if ($images->count() > 1)
                    <button type="button" @click="prev()" aria-label="Imagen anterior"
                            class="absolute p-2 transition-colors duration-200 transform -translate-y-1/2 left-4 top-1/2 bg-darki/80 text-whiteki hover:bg-golden lg:left-8 lg:p-3">
                        <x-lucide name="chevron-left" class="w-6 h-6 lg:w-8 lg:h-8" />
                    </button>
                    <button type="button" @click="next()" aria-label="Imagen siguiente"
                            class="absolute p-2 transition-colors duration-200 transform -translate-y-1/2 right-4 top-1/2 bg-darki/80 text-whiteki hover:bg-golden lg:right-8 lg:p-3">
                        <x-lucide name="chevron-right" class="w-6 h-6 lg:w-8 lg:h-8" />
                    </button>
                @endif

                <div class="absolute px-4 py-2 text-sm text-white transform -translate-x-1/2 rounded-lg bottom-4 left-1/2 bg-darki/80 lg:bottom-8 lg:text-base">
                    <span x-text="index + 1"></span> / {{ $images->count() }}
                </div>
            </div>
        </div>
    </div>
</x-layouts.app>
