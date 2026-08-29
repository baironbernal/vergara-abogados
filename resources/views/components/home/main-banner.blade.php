@props(['homeBanner' => null])

@php
    $images = collect($homeBanner?->gallery ?? [])
        ->filter()
        ->map(fn ($img) => '/storage/'.$img)
        ->values();

    if ($images->isEmpty()) {
        $images = collect([
            '/images/banner/classical-courthouse.png',
            '/images/banner/supreme-court-pillars.png',
        ]);
    }
@endphp

<div class="relative min-h-screen overflow-hidden"
     x-data="{
        index: 0,
        count: {{ $images->count() }},
        timer: null,
        start() { if (this.count > 1) this.timer = setInterval(() => this.next(), 6000) },
        next() { this.index = (this.index + 1) % this.count },
        go(i) { this.index = i; clearInterval(this.timer); this.start() },
     }"
     x-init="start()"
     @destroy="clearInterval(timer)">

    {{-- Background carousel — a translating track replaces the Framer Motion slide. --}}
    <div class="absolute inset-0 overflow-hidden">
        <div class="flex h-full transition-transform duration-700 ease-in-out"
             :style="`transform: translateX(-${index * 100}%)`">
            @foreach ($images as $i => $image)
                <div class="relative flex-shrink-0 w-full h-full">
                    <img src="{{ $image }}" alt="Sede Inmobiliaria Vergara y Abogados"
                         @if ($i > 0) loading="lazy" @else fetchpriority="high" @endif
                         class="object-cover w-full h-full">
                    <div class="absolute inset-0 bg-black/50"></div>
                </div>
            @endforeach
        </div>
    </div>

    {{-- Content --}}
    <div class="relative z-10 flex flex-col justify-center min-h-screen px-6 md:px-12 lg:px-24">
        <div class="max-w-4xl">
            <p class="mb-6 text-sm font-medium tracking-wide motion-reveal text-white/90 md:text-base"
               style="animation-delay: 0.2s">
                # Vergara Abogados
            </p>

            <div class="mb-8 motion-reveal" style="animation-delay: 0.4s">
                <h1 class="text-4xl font-light leading-relaxed tracking-tight text-white md:text-6xl lg:text-7xl font-prata">
                    <span class="inline-block mr-4 text-transparent bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text">
                        Somos
                    </span>

                    <span class="inline-flex items-center px-4 py-2 mx-4 border rounded-lg bg-amber-600/20 backdrop-blur-sm border-amber-400/30">
                        <x-lucide name="scale" class="w-8 h-8 mr-2 md:w-12 md:h-12 text-amber-400" />
                        <span class="text-2xl font-bold text-amber-200 md:text-4xl lg:text-5xl">nosotros</span>
                    </span>
                    <br>
                    <span class="text-white">Profesional respaldo Juridico</span>
                </h1>
            </div>

            <p class="max-w-2xl mb-12 text-lg leading-relaxed motion-reveal text-white/80 md:text-xl"
               style="animation-delay: 0.8s">
                Haz realidad tus sueños de vivienda con respaldo legal y confianza.
                Experiencia que guía, compromiso que acompaña, tranquilidad que perdura.
            </p>

            <div class="motion-reveal" style="animation-delay: 1s">
                <x-shared.main-button :href="route('contact')" class="max-w-[12rem] py-4">
                    Contactanos
                    <x-lucide name="arrow-right" class="w-5 h-5 ml-2" />
                </x-shared.main-button>
            </div>
        </div>
    </div>

    {{-- Carousel indicators --}}
    @if ($images->count() > 1)
        <div class="absolute z-20 transform -translate-x-1/2 bottom-8 left-1/2">
            <div class="flex space-x-2">
                @foreach ($images as $i => $image)
                    <button type="button" @click="go({{ $i }})"
                            aria-label="Ir a la imagen {{ $i + 1 }}"
                            :class="index === {{ $i }} ? 'bg-golden scale-125' : 'bg-white/40 hover:bg-white/60'"
                            class="w-3 h-3 transition-all duration-300 rounded-full"></button>
                @endforeach
            </div>
        </div>
    @endif
</div>
