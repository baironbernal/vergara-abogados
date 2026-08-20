@php
    // Contact details for the consultation card, with the same fallbacks the footer uses.
    $phone = $corporativeInfo?->corporative_whatsapp ?? '+1-258-987-000';
    $email = $corporativeInfo?->corporative_email ?? 'admin@inmobiliariavergarayabogados.com';
@endphp

<x-layouts.app>
    {{-- Banner --}}
    <x-shared.motion-wrapper>
        <x-shared.banner-informative
            picture="/images/shared/bg-services.webp"
            :title="$service->name"
            :description="$service->description ?: 'Servicio especializado en ' . $service->category" />
    </x-shared.motion-wrapper>

    {{-- Service details --}}
    <section class="w-full py-16 bg-white lg:py-20">
        <div class="px-4 mx-auto max-w-7xl lg:px-8">
            <div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                {{-- Left: service information --}}
                <x-shared.motion-wrapper>
                    <div>
                        <h2 class="mb-6 text-3xl font-bold text-darki font-prata lg:text-4xl">Detalles del Servicio</h2>

                        <div class="space-y-6">
                            <x-shared.motion-wrapper :delay="0.1">
                                <div class="p-6 border border-softGrey">
                                    <h3 class="mb-3 text-xl font-semibold text-darki font-prata">Tipo de Servicio</h3>
                                    <p class="text-greyki font-dmsans">{{ $service->type ?: 'Servicio Legal Profesional' }}</p>
                                </div>
                            </x-shared.motion-wrapper>

                            <x-shared.motion-wrapper :delay="0.2">
                                <div class="p-6 border border-softGrey">
                                    <h3 class="mb-3 text-xl font-semibold text-darki font-prata">Área de Especialización</h3>
                                    <p class="text-greyki font-dmsans">
                                        {{ $service->category }}
                                        @if ($service->subcategory)
                                            <span class="block mt-1 text-sm">Subcategoría: {{ $service->subcategory }}</span>
                                        @endif
                                    </p>
                                </div>
                            </x-shared.motion-wrapper>

                            <x-shared.motion-wrapper :delay="0.3">
                                <div class="p-6 border border-softGrey">
                                    <h3 class="mb-4 text-xl font-semibold text-darki font-prata">Beneficios de Nuestro Servicio</h3>
                                    <ul class="space-y-2 text-greyki font-dmsans">
                                        @foreach ([
                                            'Asesoría legal especializada y personalizada',
                                            'Acompañamiento durante todo el proceso',
                                            'Experiencia y conocimiento del mercado local',
                                            'Transparencia y comunicación constante',
                                        ] as $benefit)
                                            <li class="flex items-center">
                                                <x-lucide name="check-circle" class="flex-shrink-0 w-5 h-5 mr-3 text-golden" />
                                                {{ $benefit }}
                                            </li>
                                        @endforeach
                                    </ul>
                                </div>
                            </x-shared.motion-wrapper>
                        </div>
                    </div>
                </x-shared.motion-wrapper>

                {{-- Right: consultation CTA --}}
                <x-shared.motion-wrapper :delay="0.2">
                    <div class="p-8 border bg-softGrey/30 border-softGrey">
                        <h2 class="mb-6 text-3xl font-bold text-darki font-prata lg:text-4xl">Solicita tu Consulta</h2>

                        <p class="mb-6 text-greyki font-dmsans">
                            ¿Necesitas asesoría en {{ \Illuminate\Support\Str::lower($service->name) }}?
                            Nuestro equipo de expertos está listo para ayudarte con tu caso específico.
                        </p>

                        <div class="space-y-4">
                            <x-shared.motion-wrapper :delay="0.1">
                                <div class="flex items-center p-4 bg-white border border-softGrey">
                                    <x-lucide name="phone" class="flex-shrink-0 w-6 h-6 mr-4 text-golden" />
                                    <div>
                                        <h4 class="font-semibold text-darki font-prata">Llámanos</h4>
                                        <p class="text-sm text-greyki font-dmsans">{{ $phone }}</p>
                                    </div>
                                </div>
                            </x-shared.motion-wrapper>

                            <x-shared.motion-wrapper :delay="0.2">
                                <div class="flex items-center p-4 bg-white border border-softGrey">
                                    <x-lucide name="mail" class="flex-shrink-0 w-6 h-6 mr-4 text-golden" />
                                    <div>
                                        <h4 class="font-semibold text-darki font-prata">Escríbenos</h4>
                                        <p class="text-sm break-all text-greyki font-dmsans">{{ $email }}</p>
                                    </div>
                                </div>
                            </x-shared.motion-wrapper>

                            <x-shared.motion-wrapper :delay="0.3">
                                <div class="flex items-center p-4 bg-white border border-softGrey">
                                    <x-lucide name="clock" class="flex-shrink-0 w-6 h-6 mr-4 text-golden" />
                                    <div>
                                        <h4 class="font-semibold text-darki font-prata">Horario</h4>
                                        <p class="text-sm text-greyki font-dmsans">Lun - Vie: 9:00 - 17:00</p>
                                    </div>
                                </div>
                            </x-shared.motion-wrapper>
                        </div>

                        <x-shared.motion-wrapper :delay="0.4">
                            <div class="mt-8">
                                <x-shared.main-button :href="route('contact')" class="justify-center w-full">
                                    Solicitar Consulta
                                </x-shared.main-button>
                            </div>
                        </x-shared.motion-wrapper>
                    </div>
                </x-shared.motion-wrapper>
            </div>
        </div>
    </section>

    {{--
        NOTE: the controller emits FAQPage JSON-LD from $service->faq, but neither the
        React page nor this one renders those Q&As visibly. Kept as-is for parity;
        flagged because FAQPage markup without matching on-page content is against
        Google's structured-data guidelines. Decide separately from this migration.
    --}}

    {{-- Team --}}
    <x-services.lawyers-section
        :lawyers="$lawyers"
        title="Nuestro Equipo Especializado"
        :subtitle="'Conoce a nuestros abogados especialistas que pueden ayudarte con ' . $service->name"
        background="bg-white" />
</x-layouts.app>
