@php
    $inputClasses = 'w-full px-3 py-2 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden font-dmsans lg:px-4 lg:py-3';
@endphp

<div class="px-4 py-8 mx-auto max-w-7xl lg:py-12" x-data="{ filtersOpen: false }">
    {{-- Mobile filters toggle --}}
    <div class="mb-6 lg:hidden">
        <button type="button" @click="filtersOpen = !filtersOpen"
                :aria-expanded="filtersOpen"
                class="flex items-center justify-between w-full p-4 text-left bg-white border shadow-lg border-softGrey">
            <div class="flex items-center gap-3">
                <x-lucide name="filter" class="w-5 h-5 text-golden" />
                <span class="font-medium text-darki font-dmsans">Filtros de Búsqueda</span>
            </div>
            <x-lucide name="chevron-down" class="w-5 h-5" x-show="!filtersOpen" />
            <x-lucide name="chevron-up" class="w-5 h-5" x-show="filtersOpen" x-cloak />
        </button>
    </div>

    <div class="flex flex-col gap-8 lg:flex-row">
        {{-- Filters sidebar --}}
        <aside class="lg:flex-shrink-0 lg:w-80" :class="filtersOpen ? 'block' : 'hidden lg:block'">
            <div class="p-6 bg-white border shadow-lg lg:sticky lg:top-4 border-softGrey lg:p-8">
                <h2 class="flex items-center gap-3 mb-6 text-lg font-medium text-darki font-dmsans lg:mb-8 lg:text-xl">
                    <x-lucide name="filter" class="w-5 h-5 text-golden lg:w-6 lg:h-6" />
                    Filtros de Búsqueda
                </h2>

                <div class="space-y-4 lg:space-y-6">
                    {{-- Department --}}
                    <div>
                        <label for="filter-state" class="block mb-2 text-sm font-medium text-darki font-dmsans lg:mb-3">Departamento</label>
                        <select id="filter-state" wire:model.live="state_id" class="{{ $inputClasses }}">
                            <option value="">Todos los departamentos</option>
                            @foreach ($states as $state)
                                <option value="{{ $state->id }}">{{ $state->name }}</option>
                            @endforeach
                        </select>
                    </div>

                    {{-- Municipality — disabled until a department is chosen --}}
                    <div>
                        <label for="filter-municipality" class="block mb-2 text-sm font-medium text-darki font-dmsans lg:mb-3">Municipio</label>
                        <select id="filter-municipality" wire:model.live="municipality_id"
                                @disabled($state_id === '')
                                class="{{ $inputClasses }} disabled:bg-softGrey disabled:cursor-not-allowed">
                            <option value="">Todos los municipios</option>
                            @foreach ($municipalities as $municipality)
                                <option value="{{ $municipality->id }}">{{ $municipality->name }}</option>
                            @endforeach
                        </select>
                    </div>

                    {{-- Price range --}}
                    <div class="space-y-2 lg:space-y-3">
                        <label class="block text-sm font-medium text-darki font-dmsans">Rango de Precio</label>
                        <div class="grid grid-cols-2 gap-2 lg:gap-3">
                            <input type="number" min="0" wire:model.live.debounce.500ms="minPrice"
                                   placeholder="Mínimo" aria-label="Precio mínimo" class="{{ $inputClasses }}">
                            <input type="number" min="0" wire:model.live.debounce.500ms="maxPrice"
                                   placeholder="Máximo" aria-label="Precio máximo" class="{{ $inputClasses }}">
                        </div>
                    </div>

                    {{-- Property type --}}
                    <div>
                        <label for="filter-type" class="block mb-2 text-sm font-medium text-darki font-dmsans lg:mb-3">Tipo de Propiedad</label>
                        <select id="filter-type" wire:model.live="propertyType" class="{{ $inputClasses }}">
                            <option value="">Todos los tipos</option>
                            @foreach ($propertyTypes as $type)
                                {{-- Value stays the stored key; the label is its Spanish name. --}}
                                <option value="{{ $type['value'] }}">{{ $type['label'] }}</option>
                            @endforeach
                        </select>
                    </div>

                    {{-- Results count --}}
                    <div class="pt-4 text-sm border-t border-softGrey text-greyki font-dmsans lg:pt-6">
                        Mostrando {{ $properties->total() }} {{ $properties->total() === 1 ? 'propiedad' : 'propiedades' }}
                    </div>

                    <x-shared.main-button type="button" wire:click="clearFilters" class="justify-center w-full">
                        Limpiar Filtros
                    </x-shared.main-button>
                </div>
            </div>
        </aside>

        {{-- Results --}}
        <section class="flex-1 min-w-0">
            @if ($properties->isNotEmpty())
                <div class="grid w-full grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:gap-8 lg:mb-12 xl:grid-cols-3">
                    @foreach ($properties as $property)
                        <div wire:key="property-{{ $property->id }}" class="h-full">
                            <x-properties.card :property="$property" />
                        </div>
                    @endforeach
                </div>

                {{-- Pagination: real links so crawlers can follow them --}}
                @if ($properties->lastPage() > 1)
                    <nav aria-label="Paginación de propiedades"
                         class="flex flex-col items-center justify-center gap-4 lg:flex-row lg:gap-3">
                        @if ($properties->currentPage() > 1)
                            <a href="{{ $this->pageUrl($properties->currentPage() - 1) }}" wire:navigate
                               class="px-4 py-2 text-sm transition-colors duration-200 border border-golden text-golden hover:bg-golden hover:text-whiteki font-dmsans lg:px-5 lg:py-3">
                                Anterior
                            </a>
                        @endif

                        <div class="flex flex-wrap justify-center gap-1 lg:gap-2">
                            @foreach (range(1, $properties->lastPage()) as $page)
                                <a href="{{ $this->pageUrl($page) }}" wire:navigate
                                   @if ($page === $properties->currentPage()) aria-current="page" @endif
                                   class="min-w-[40px] px-3 py-2 text-sm font-medium font-dmsans transition-all duration-300 lg:min-w-[44px] lg:px-4 lg:py-3 text-center
                                          {{ $page === $properties->currentPage()
                                                ? 'bg-darki text-whiteki shadow-lg scale-110'
                                                : 'border border-graykiSecondary bg-white hover:bg-darki hover:text-whiteki' }}">
                                    {{ $page }}
                                </a>
                            @endforeach
                        </div>

                        @if ($properties->hasMorePages())
                            <a href="{{ $this->pageUrl($properties->currentPage() + 1) }}" wire:navigate
                               class="px-4 py-2 text-sm transition-colors duration-200 border border-golden text-golden hover:bg-golden hover:text-whiteki font-dmsans lg:px-5 lg:py-3">
                                Siguiente
                            </a>
                        @endif
                    </nav>
                @endif
            @else
                <div class="flex flex-col items-center justify-center w-full px-4 text-center">
                    <h3 class="mb-4 text-xl font-medium text-darki font-prata lg:text-2xl">No se encontraron propiedades</h3>
                    <p class="mb-6 text-base text-greyki font-dmsans lg:mb-8 lg:text-lg">
                        No hay propiedades que coincidan con tus criterios de búsqueda
                    </p>
                    <x-shared.main-button type="button" wire:click="clearFilters" class="px-6 py-3 m-auto shadow-lg lg:px-8 lg:py-4">
                        Limpiar Todos los Filtros
                    </x-shared.main-button>
                </div>
            @endif
        </section>
    </div>
</div>
