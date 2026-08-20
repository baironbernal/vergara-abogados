@props([
    'lawyers' => [],
    'title' => 'Nuestro Equipo',
    'subtitle' => 'Conoce a nuestros abogados especialistas en derecho inmobiliario',
    'background' => 'bg-whiteki',
])

@php $lawyers = collect($lawyers)->values(); @endphp

@if ($lawyers->isNotEmpty())
    <section class="w-full py-12 lg:py-20 {{ $background }}">
        <div class="px-4 mx-auto max-w-7xl lg:px-8">
            <x-shared.motion-wrapper>
                <div class="mb-12 text-center lg:mb-16">
                    <h2 class="mb-4 text-3xl font-bold text-darki font-prata lg:text-4xl">{{ $title }}</h2>
                    <p class="max-w-2xl mx-auto text-lg text-greyki font-dmsans lg:text-xl">{{ $subtitle }}</p>
                    <div class="w-16 h-1 mx-auto mt-6 bg-golden lg:w-24"></div>
                </div>
            </x-shared.motion-wrapper>

            <div class="grid max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-2 lg:grid-cols-3">
                @foreach ($lawyers as $index => $lawyer)
                    <x-shared.motion-wrapper :delay="$index * 0.1">
                        <x-home.lawyer-card :lawyer="$lawyer" />
                    </x-shared.motion-wrapper>
                @endforeach
            </div>
        </div>
    </section>
@endif
