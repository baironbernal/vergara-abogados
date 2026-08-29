<x-layouts.app>
    <div class="min-h-screen bg-whiteki">
        {{--
            The React page had no <h1> at all — the only page on the site missing one.
            Added here so the listing has a crawlable primary heading; this is the one
            intentional departure from strict React parity.
        --}}
        <div class="px-4 pt-10 mx-auto max-w-7xl lg:pt-14">
            <h1 class="mb-3 text-3xl font-medium text-darki font-prata lg:text-4xl">
                Propiedades en Venta y Arriendo
            </h1>
            <p class="max-w-3xl text-base text-greyki font-dmsans lg:text-lg">
                Casas, apartamentos, lotes y fincas en Soacha y Cundinamarca, con respaldo jurídico
                en cada transacción.
            </p>
        </div>

        {{-- Filters, results and pagination live in the Livewire component. --}}
        <livewire:property-catalog />
    </div>
</x-layouts.app>
