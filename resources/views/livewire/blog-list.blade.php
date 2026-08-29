<div class="px-4 py-8 mx-auto max-w-7xl lg:py-12">
    {{-- Search and filters --}}
    <section class="mb-8 lg:mb-12">
        <x-shared.motion-wrapper>
            <div class="p-6 bg-white shadow-lg lg:p-8">
                <form wire:submit="applyFilters" class="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
                    <div class="flex-1">
                        <label for="blog-search" class="block mb-2 text-sm font-medium text-darki font-dmsans lg:mb-3">
                            Buscar artículos
                        </label>
                        <div class="relative">
                            <x-lucide name="search" class="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-greyki lg:w-5 lg:h-5" />
                            <input id="blog-search" type="text" wire:model="search" maxlength="100"
                                   placeholder="Buscar por título, contenido..."
                                   class="w-full py-2 pl-10 pr-4 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden font-dmsans lg:py-3 lg:pl-12">
                        </div>
                    </div>

                    <div class="flex items-center">
                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox" wire:model="featured"
                                   class="w-4 h-4 mr-2 transition-colors duration-200 border-2 border-golden text-golden focus:ring-golden focus:ring-2 lg:w-5 lg:h-5 lg:mr-3">
                            <span class="text-sm font-medium text-darki font-dmsans">Solo destacados</span>
                        </label>
                    </div>

                    <div class="flex flex-col gap-2 sm:flex-row sm:gap-3">
                        <x-shared.main-button type="submit" class="px-6 py-2 lg:px-8 lg:py-3">
                            <x-lucide name="search" class="w-4 h-4 mr-2" />
                            Buscar
                        </x-shared.main-button>

                        @if ($search !== '' || $featured)
                            <button type="button" wire:click="clearFilters"
                                    class="px-4 py-2 transition-colors duration-200 border text-greyki hover:text-darki font-dmsans border-graykiSecondary hover:border-darki lg:px-6 lg:py-3">
                                Limpiar
                            </button>
                        @endif
                    </div>
                </form>
            </div>
        </x-shared.motion-wrapper>
    </section>

    {{-- Results --}}
    <section>
        @if ($blogs->isNotEmpty())
            <div class="grid gap-6 md:grid-cols-2 lg:gap-8 lg:grid-cols-3">
                @foreach ($blogs as $blog)
                    <x-shared.motion-wrapper wire:key="blog-{{ $blog->id }}">
                        <x-blog.card :blog="$blog" />
                    </x-shared.motion-wrapper>
                @endforeach
            </div>

            {{-- Pagination: real links so crawlers can follow them --}}
            @if ($blogs->lastPage() > 1)
                <x-shared.motion-wrapper>
                    <nav aria-label="Paginación de artículos"
                         class="flex flex-col items-center justify-center gap-4 mt-8 lg:flex-row lg:gap-3 lg:mt-12">
                        @if ($blogs->currentPage() > 1)
                            <a href="{{ $this->pageUrl($blogs->currentPage() - 1) }}" wire:navigate
                               class="px-4 py-2 text-sm transition-colors duration-200 border border-golden text-golden hover:bg-golden hover:text-whiteki font-dmsans lg:px-5 lg:py-3">
                                Anterior
                            </a>
                        @endif

                        <div class="flex flex-wrap justify-center gap-1 lg:gap-2">
                            @foreach (range(1, $blogs->lastPage()) as $page)
                                <a href="{{ $this->pageUrl($page) }}" wire:navigate
                                   @if ($page === $blogs->currentPage()) aria-current="page" @endif
                                   class="min-w-[36px] px-3 py-2 text-sm font-medium font-dmsans transition-all duration-300 lg:min-w-[44px] lg:px-4 lg:py-3 text-center
                                          {{ $page === $blogs->currentPage()
                                                ? 'bg-golden text-whiteki shadow-lg scale-110'
                                                : 'border border-graykiSecondary bg-white hover:bg-darki hover:text-whiteki' }}">
                                    {{ $page }}
                                </a>
                            @endforeach
                        </div>

                        @if ($blogs->hasMorePages())
                            <a href="{{ $this->pageUrl($blogs->currentPage() + 1) }}" wire:navigate
                               class="px-4 py-2 text-sm transition-colors duration-200 border border-golden text-golden hover:bg-golden hover:text-whiteki font-dmsans lg:px-5 lg:py-3">
                                Siguiente
                            </a>
                        @endif
                    </nav>
                </x-shared.motion-wrapper>
            @endif
        @else
            <x-shared.motion-wrapper>
                <div class="py-12 text-center lg:py-16">
                    <div class="max-w-md mx-auto">
                        <h3 class="mb-4 text-xl font-medium text-darki font-prata lg:text-2xl">
                            No se encontraron artículos
                        </h3>
                        <p class="mb-6 text-base text-greyki font-dmsans lg:mb-8 lg:text-lg">
                            No hay artículos que coincidan con tus criterios de búsqueda
                        </p>
                        <x-shared.main-button type="button" wire:click="clearFilters" class="px-6 py-3 m-auto shadow-lg lg:px-8 lg:py-4">
                            Ver todos los artículos
                        </x-shared.main-button>
                    </div>
                </div>
            </x-shared.motion-wrapper>
        @endif
    </section>
</div>
