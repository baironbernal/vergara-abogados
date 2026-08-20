@php
    $address = $corporativeInfo?->office_address ?? "Cl. 12 #8 05,\nSoacha Cundinamarca,\nColombia";
    $phone = $corporativeInfo?->corporative_whatsapp ?? '+1-258-987-000';
    $email = $corporativeInfo?->corporative_email ?? 'admin@inmobiliariavergarayabogados.com';

    $officeHours = [
        'Lunes' => '09:00-17:00',
        'Martes' => '09:00-17:00',
        'Miércoles' => '09:00-17:00',
        'Jueves' => '09:00-17:00',
        'Viernes' => '09:00-17:00',
        'Sábado' => '10:00-13:00',
        'Domingo' => 'Cerrado',
    ];
@endphp

<x-layouts.app>
    <section class="w-full py-16 lg:py-24"
             style="background-image: url('/images/shared/service-background.webp'); background-size: cover; background-position: center; background-repeat: no-repeat;">
        <div class="px-4 mx-auto max-w-7xl lg:px-8">
            <div class="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">

                {{-- Form (2/3) --}}
                <div class="w-full lg:col-span-2">
                    <x-shared.motion-wrapper>
                        <div class="mb-8 text-center">
                            <h1 class="mb-4 text-3xl font-bold text-darki font-prata lg:text-4xl">Escribe tu Mensaje</h1>
                            <div class="flex items-center justify-center mb-6">
                                <div class="w-8 h-px bg-golden"></div>
                                <div class="mx-4 text-golden">//</div>
                                <div class="w-8 h-px bg-golden"></div>
                            </div>
                        </div>

                        <div id="contact-form">
                            <livewire:contact-form />
                        </div>
                    </x-shared.motion-wrapper>
                </div>

                {{-- Contact information (1/3) --}}
                <div class="w-full lg:col-span-1">
                    <x-shared.motion-wrapper :delay="0.2">
                        <div class="mb-8 text-center">
                            <h2 class="mb-4 text-3xl font-bold text-darki font-prata lg:text-4xl">Ponte en Contacto con Nosotros</h2>
                            <div class="flex items-center justify-center mb-6">
                                <div class="w-8 h-px bg-golden"></div>
                                <div class="mx-4 text-golden">//</div>
                                <div class="w-8 h-px bg-golden"></div>
                            </div>
                        </div>

                        <div class="space-y-6">
                            {{-- Address --}}
                            <x-shared.motion-wrapper :delay="0.1">
                                <div class="flex items-start p-4 space-x-3 bg-white border border-softGrey">
                                    <div class="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-golden">
                                        <x-lucide name="map-pin" class="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 class="mb-1 text-lg font-bold text-darki font-prata">Dirección</h3>
                                        <p class="text-sm whitespace-pre-line text-greyki font-dmsans">{{ $address }}</p>
                                    </div>
                                </div>
                            </x-shared.motion-wrapper>

                            {{-- Phone & email --}}
                            <x-shared.motion-wrapper :delay="0.2">
                                <div class="flex items-start p-4 space-x-3 bg-white border border-softGrey">
                                    <div class="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-golden">
                                        <x-lucide name="phone" class="w-5 h-5 text-white" />
                                    </div>
                                    <div class="min-w-0">
                                        <h3 class="mb-1 text-lg font-bold text-darki font-prata">Teléfono</h3>
                                        <p class="mb-1 text-sm text-greyki font-dmsans">{{ $phone }}</p>
                                        <p class="text-sm break-all text-greyki font-dmsans">{{ $email }}</p>
                                    </div>
                                </div>
                            </x-shared.motion-wrapper>

                            {{-- Office hours --}}
                            <x-shared.motion-wrapper :delay="0.3">
                                <div class="flex items-start p-4 space-x-3 bg-white border border-softGrey">
                                    <div class="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-golden">
                                        <x-lucide name="clock" class="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 class="mb-1 text-lg font-bold text-darki font-prata">Horario de Atención</h3>
                                        <div class="space-y-0.5 text-xs text-greyki font-dmsans">
                                            @foreach ($officeHours as $day => $hours)
                                                <p><strong>{{ $day }}:</strong> {{ $hours }}</p>
                                            @endforeach
                                        </div>
                                    </div>
                                </div>
                            </x-shared.motion-wrapper>
                        </div>

                        <x-shared.motion-wrapper :delay="0.4">
                            <div class="p-4 mt-6 border bg-softGrey/30 border-softGrey">
                                <h3 class="mb-3 text-lg font-bold text-center text-darki font-prata">¿Necesitas ayuda inmediata?</h3>
                                <p class="mb-3 text-sm text-center text-greyki font-dmsans">
                                    Nuestro equipo está disponible para responder tus consultas y brindarte la mejor asesoría legal.
                                </p>
                                <p class="text-xs text-center text-greyki font-dmsans">
                                    <strong>Respuesta garantizada en menos de 24 horas</strong>
                                </p>
                            </div>
                        </x-shared.motion-wrapper>
                    </x-shared.motion-wrapper>
                </div>
            </div>
        </div>
    </section>
</x-layouts.app>
