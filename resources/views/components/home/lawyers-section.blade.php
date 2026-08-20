@props(['lawyers' => []])

@php $lawyers = collect($lawyers)->values(); @endphp

@if ($lawyers->isNotEmpty())
    <section class="py-20 bg-whiteki">
        <div class="px-4 mx-auto max-w-7xl">
            {{-- Header --}}
            <x-shared.motion-wrapper>
                <div class="flex items-end justify-between mb-16">
                    <div>
                        <h2 class="mb-4 text-4xl font-medium md:text-5xl text-darki font-prata">Nuestro Equipo</h2>
                        <p class="max-w-3xl text-lg text-greyki font-dmsans">
                            Contamos con amplia experiencia en todas las industrias. Brindamos a cada cliente
                            una combinación de conocimiento profundo de la industria y perspectivas expertas
                            para ofrecer ideas frescas y soluciones innovadoras.
                        </p>
                    </div>
                    <div class="hidden md:block">
                        <a href="{{ route('about') }}" wire:navigate class="flex items-center gap-2 text-lg transition-colors duration-300 text-golden hover:text-darki font-dmsans">
                            Ver Todos
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                        </a>
                    </div>
                </div>
            </x-shared.motion-wrapper>

            {{-- Desktop grid (first 3) --}}
            <x-shared.motion-wrapper :delay="0.2">
                <div class="hidden lg:grid lg:grid-cols-3 lg:gap-0">
                    @foreach ($lawyers->take(3) as $lawyer)
                        <x-home.lawyer-card :lawyer="$lawyer" />
                    @endforeach
                </div>
            </x-shared.motion-wrapper>

            {{-- Mobile carousel --}}
            <div class="relative lg:hidden"
                 x-data="{
                    current: 0,
                    count: {{ $lawyers->count() }},
                    timer: null,
                    start() { if (this.count > 1) this.timer = setInterval(() => this.next(), 5000); },
                    next() { this.current = this.current === this.count - 1 ? 0 : this.current + 1; },
                    prev() { this.current = this.current === 0 ? this.count - 1 : this.current - 1; },
                 }"
                 x-init="start()"
                 @destroy="clearInterval(timer)">
                <div class="overflow-hidden">
                    <div class="flex transition-transform duration-500 ease-in-out"
                         :style="`transform: translateX(-${current * 100}%)`">
                        @foreach ($lawyers as $lawyer)
                            <div class="flex-shrink-0 w-full">
                                <x-home.lawyer-card :lawyer="$lawyer" />
                            </div>
                        @endforeach
                    </div>
                </div>

                @if ($lawyers->count() > 1)
                    <button @click="prev()" class="absolute z-10 p-3 transition-all duration-300 transform -translate-y-1/2 rounded-full shadow-lg left-4 top-1/2 bg-darki text-whiteki hover:bg-golden" aria-label="Anterior abogado">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <button @click="next()" class="absolute z-10 p-3 transition-all duration-300 transform -translate-y-1/2 rounded-full shadow-lg right-4 top-1/2 bg-darki text-whiteki hover:bg-golden" aria-label="Siguiente abogado">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </button>

                    <div class="flex justify-center mt-8 space-x-3">
                        @foreach ($lawyers as $i => $lawyer)
                            <button @click="current = {{ $i }}"
                                    :class="current === {{ $i }} ? 'bg-golden transform scale-125' : 'bg-graykiSecondary hover:bg-golden'"
                                    class="w-3 h-3 rounded-full transition-all duration-300"
                                    aria-label="Ir al abogado {{ $i + 1 }}"></button>
                        @endforeach
                    </div>
                @endif
            </div>

            {{-- CTA --}}
            @if ($lawyers->count() > 3)
                <x-shared.motion-wrapper :delay="0.4">
                    <div class="mt-12 text-center">
                        <x-shared.main-button :href="route('about')" class="px-8 py-4">Ver Todo el Equipo</x-shared.main-button>
                    </div>
                </x-shared.motion-wrapper>
            @endif
        </div>
    </section>
@endif
