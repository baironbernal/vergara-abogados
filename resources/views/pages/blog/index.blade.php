<x-layouts.app>
    <x-shared.motion-wrapper>
        <x-shared.banner-informative
            picture="/images/shared/background-title.webp"
            title="Blog"
            description="Artículos, noticias y consejos sobre bienes raíces y derecho inmobiliario" />
    </x-shared.motion-wrapper>

    <div class="min-h-screen bg-whiteki">
        {{-- Search, filters and pagination live in the Livewire component. --}}
        <livewire:blog-list />
    </div>
</x-layouts.app>
