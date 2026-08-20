<x-layouts.app>
    {{-- Banner --}}
    <x-shared.motion-wrapper>
        <x-shared.banner-informative
            picture="/images/shared/bg-services.webp"
            title="Servicios"
            description="Descubre los servicios legales que ofrecemos para proteger tus derechos y resolver tus problemas" />
    </x-shared.motion-wrapper>

    {{-- Services grid --}}
    <section class="relative w-full py-12 lg:py-20"
             style="background-image: url('/images/shared/service-background.webp'); background-size: cover; background-position: center; background-repeat: no-repeat;">
        <x-shared.motion-wrapper>
            <div class="grid grid-cols-1 gap-6 px-4 mx-auto max-w-7xl sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:px-8">
                @foreach ($services as $service)
                    <div class="h-full">
                        <x-services.card-service :service="$service" />
                    </div>
                @endforeach
            </div>
        </x-shared.motion-wrapper>
    </section>

    {{-- Team --}}
    <x-services.lawyers-section :lawyers="$lawyers" />
</x-layouts.app>
