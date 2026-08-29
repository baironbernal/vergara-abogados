@props(['property'])

<div class="flex flex-col h-full overflow-hidden transition-all duration-300 bg-white border shadow-lg border-softGrey hover:shadow-xl hover:scale-[1.02]">
    <div class="relative">
        <img src="{{ $property->thumbnail ? '/storage/' . $property->thumbnail : '/placeholder.svg' }}"
             alt="{{ $property->name }}"
             loading="lazy"
             class="object-cover w-full h-48 sm:h-56">
        <span class="absolute px-2 py-1 text-xs font-medium shadow-lg top-3 right-3 bg-golden text-whiteki font-dmsans lg:top-4 lg:right-4 lg:px-3 lg:py-1">
            {{ $property->type_spanish }}
        </span>
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>

    <div class="flex flex-col flex-grow p-4 lg:p-6">
        <h3 class="mb-2 text-lg font-medium leading-tight text-darki font-dmsans lg:mb-3 lg:text-xl">
            {{ $property->name }}
        </h3>

        <p class="mb-3 text-xl font-bold text-golden font-prata lg:mb-4 lg:text-2xl">
            ${{ $property->formatted_price }}
        </p>

        <div class="flex items-center mb-3 text-greyki lg:mb-4">
            <x-lucide name="map-pin" class="flex-shrink-0 w-4 h-4 mr-2 text-golden lg:w-5 lg:h-5" />
            <span class="text-xs font-dmsans lg:text-sm">
                {{ collect([$property->municipality?->name, $property->state?->name])->filter()->implode(', ') }}
            </span>
        </div>

        @if ($property->size)
            <div class="mb-3 text-xs text-greyki font-dmsans lg:mb-4 lg:text-sm">
                <strong>Área:</strong> {{ $property->size }} m²
            </div>
        @endif

        @if ($property->description)
            <p class="flex-grow mb-4 text-xs leading-relaxed text-greyki line-clamp-3 font-dmsans lg:mb-6 lg:text-sm">
                {{ $property->description }}
            </p>
        @endif
    </div>

    <div class="px-4 pb-4 mt-auto lg:px-6 lg:pb-6">
        <x-shared.main-button :href="route('property.show', $property)" class="justify-center w-full">
            Ver Detalles
        </x-shared.main-button>
    </div>
</div>
