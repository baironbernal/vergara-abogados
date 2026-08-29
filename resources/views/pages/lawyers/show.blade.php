@php
    $socials = array_filter([
        'linkedin' => $lawyer->linkedin,
        'facebook' => $lawyer->facebook,
        'twitter' => $lawyer->twitter,
        'instagram' => $lawyer->instagram,
    ]);
@endphp

<x-layouts.app>
    <div class="min-h-screen bg-whiteki">
        {{-- Profile header --}}
        <x-shared.motion-wrapper>
            <div class="bg-darki">
                <div class="px-4 py-16 mx-auto max-w-7xl lg:py-24">
                    <div class="grid gap-8 lg:grid-cols-3 lg:gap-12">
                        <div class="lg:col-span-1">
                            <div class="overflow-hidden border-4 aspect-square border-golden">
                                <img src="{{ $lawyer->image ? '/storage/' . $lawyer->image : '/placeholder.svg' }}"
                                     alt="{{ $lawyer->name }}"
                                     class="object-cover w-full h-full">
                            </div>
                        </div>

                        <div class="lg:col-span-2">
                            <h1 class="mb-2 text-3xl font-bold text-whiteki font-prata lg:text-5xl">{{ $lawyer->name }}</h1>

                            @if ($lawyer->title)
                                <p class="mb-4 text-xl text-golden font-dmsans lg:text-2xl">{{ $lawyer->title }}</p>
                            @endif

                            <p class="mb-6 text-lg text-graykiSecondary font-dmsans">{{ $lawyer->profession }}</p>

                            @if ($lawyer->description)
                                <p class="mb-8 text-base leading-relaxed text-whiteki font-dmsans lg:text-lg">{{ $lawyer->description }}</p>
                            @endif

                            {{-- Contact info --}}
                            <div class="grid gap-4 mb-8 sm:grid-cols-2">
                                @foreach ([
                                    ['phone', $lawyer->phone],
                                    ['mail', $lawyer->email],
                                    ['map-pin', $lawyer->office_location],
                                    ['clock', $lawyer->office_hours],
                                ] as [$icon, $value])
                                    @if ($value)
                                        <div class="flex items-center gap-3 text-whiteki">
                                            <x-lucide :name="$icon" class="flex-shrink-0 w-5 h-5 text-golden" />
                                            <span class="font-dmsans">{{ $value }}</span>
                                        </div>
                                    @endif
                                @endforeach
                            </div>

                            {{-- Social media --}}
                            @if ($socials)
                                <div class="flex gap-4">
                                    @foreach ($socials as $network => $url)
                                        <a href="{{ $url }}" target="_blank" rel="noopener noreferrer"
                                           aria-label="{{ ucfirst($network) }}"
                                           class="p-2 transition-colors border-2 border-golden text-golden hover:bg-golden hover:text-darki">
                                            <x-lucide :name="$network" class="w-5 h-5" />
                                        </a>
                                    @endforeach
                                </div>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </x-shared.motion-wrapper>

        {{-- Stats --}}
        @if ($lawyer->years_experience || $lawyer->cases_won || filled($lawyer->specializations))
            <x-shared.motion-wrapper :delay="0.2">
                <div class="px-4 py-12 bg-white lg:py-16">
                    <div class="mx-auto max-w-7xl">
                        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            @if ($lawyer->years_experience)
                                <div class="p-6 text-center border-2 border-golden lg:p-8">
                                    <div class="mb-4 text-4xl font-bold text-golden font-prata lg:text-5xl">{{ $lawyer->years_experience }}+</div>
                                    <div class="text-lg text-darki font-dmsans">Años de Experiencia</div>
                                </div>
                            @endif

                            @if ($lawyer->cases_won)
                                <div class="p-6 text-center border-2 border-golden lg:p-8">
                                    <div class="mb-4 text-4xl font-bold text-golden font-prata lg:text-5xl">{{ $lawyer->cases_won }}+</div>
                                    <div class="text-lg text-darki font-dmsans">Casos Ganados</div>
                                </div>
                            @endif

                            @if (filled($lawyer->specializations))
                                <div class="p-6 text-center border-2 border-golden lg:p-8 sm:col-span-2 lg:col-span-1">
                                    <div class="mb-4 text-4xl font-bold text-golden font-prata lg:text-5xl">{{ count($lawyer->specializations) }}</div>
                                    <div class="text-lg text-darki font-dmsans">Especializaciones</div>
                                </div>
                            @endif
                        </div>
                    </div>
                </div>
            </x-shared.motion-wrapper>
        @endif

        <div class="px-4 py-12 mx-auto max-w-7xl lg:py-16">
            <div class="grid gap-12 lg:grid-cols-3 lg:gap-16">
                {{-- Main content --}}
                <div class="lg:col-span-2">
                    {{-- Biography --}}
                    @if ($lawyer->bio)
                        <x-shared.motion-wrapper :delay="0.3">
                            <section class="mb-12">
                                <h2 class="mb-6 text-2xl font-bold text-darki font-prata lg:text-3xl">Sobre Mí</h2>
                                {{-- Sanitized server-side; replaces the DOMPurify pass React did (§10). --}}
                                <x-shared.rich-text :html="$lawyer->bio" class="text-greyki font-dmsans" />
                            </section>
                        </x-shared.motion-wrapper>
                    @endif

                    {{-- Education --}}
                    @if (filled($lawyer->education))
                        <x-shared.motion-wrapper :delay="0.4">
                            <section class="mb-12">
                                <div class="flex items-center gap-3 mb-6">
                                    <x-lucide name="graduation-cap" class="w-8 h-8 text-golden" />
                                    <h2 class="text-2xl font-bold text-darki font-prata lg:text-3xl">Educación</h2>
                                </div>
                                <div class="space-y-6">
                                    @foreach ($lawyer->education as $edu)
                                        <div class="p-6 border-l-4 border-golden bg-softGrey">
                                            <h3 class="mb-2 text-xl font-bold text-darki font-prata">{{ $edu['degree'] ?? '' }}</h3>
                                            <p class="mb-1 text-lg text-golden font-dmsans">{{ $edu['institution'] ?? '' }}</p>
                                            @if (! empty($edu['year']))
                                                <p class="text-greyki font-dmsans">{{ $edu['year'] }}</p>
                                            @endif
                                        </div>
                                    @endforeach
                                </div>
                            </section>
                        </x-shared.motion-wrapper>
                    @endif

                    {{-- Experience --}}
                    @if (filled($lawyer->experience))
                        <x-shared.motion-wrapper :delay="0.5">
                            <section class="mb-12">
                                <div class="flex items-center gap-3 mb-6">
                                    <x-lucide name="briefcase" class="w-8 h-8 text-golden" />
                                    <h2 class="text-2xl font-bold text-darki font-prata lg:text-3xl">Experiencia Profesional</h2>
                                </div>
                                <div class="space-y-6">
                                    @foreach ($lawyer->experience as $exp)
                                        <div class="p-6 border-l-4 border-golden bg-softGrey">
                                            <h3 class="mb-2 text-xl font-bold text-darki font-prata">{{ $exp['position'] ?? '' }}</h3>
                                            <p class="mb-1 text-lg text-golden font-dmsans">{{ $exp['company'] ?? '' }}</p>
                                            @if (! empty($exp['period']))
                                                <p class="mb-3 text-greyki font-dmsans">{{ $exp['period'] }}</p>
                                            @endif
                                            @if (! empty($exp['description']))
                                                <p class="text-greyki font-dmsans">{{ $exp['description'] }}</p>
                                            @endif
                                        </div>
                                    @endforeach
                                </div>
                            </section>
                        </x-shared.motion-wrapper>
                    @endif

                    {{-- Achievements --}}
                    @if (filled($lawyer->achievements))
                        <x-shared.motion-wrapper :delay="0.6">
                            <section class="mb-12">
                                <div class="flex items-center gap-3 mb-6">
                                    <x-lucide name="award" class="w-8 h-8 text-golden" />
                                    <h2 class="text-2xl font-bold text-darki font-prata lg:text-3xl">Logros y Reconocimientos</h2>
                                </div>
                                <div class="space-y-4">
                                    @foreach ($lawyer->achievements as $achievement)
                                        <div class="p-6 bg-white border-2 border-golden">
                                            <div class="flex items-start gap-4">
                                                <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-golden">
                                                    <x-lucide name="award" class="w-6 h-6 text-white" />
                                                </div>
                                                <div class="flex-1">
                                                    <h3 class="mb-1 text-lg font-bold text-darki font-prata">{{ $achievement['title'] ?? '' }}</h3>
                                                    @if (! empty($achievement['year']))
                                                        <p class="mb-2 text-golden font-dmsans">{{ $achievement['year'] }}</p>
                                                    @endif
                                                    @if (! empty($achievement['description']))
                                                        <p class="text-greyki font-dmsans">{{ $achievement['description'] }}</p>
                                                    @endif
                                                </div>
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            </section>
                        </x-shared.motion-wrapper>
                    @endif
                </div>

                {{-- Sidebar --}}
                <div class="lg:col-span-1">
                    {{-- Specializations --}}
                    @if (filled($lawyer->specializations))
                        <x-shared.motion-wrapper :delay="0.7">
                            <section class="mb-8">
                                <div class="p-6 bg-white border-2 border-golden lg:p-8">
                                    <div class="flex items-center gap-3 mb-6">
                                        <x-lucide name="scale" class="w-6 h-6 text-golden" />
                                        <h2 class="text-xl font-bold text-darki font-prata lg:text-2xl">Áreas de Especialización</h2>
                                    </div>
                                    <div class="space-y-6">
                                        @foreach ($lawyer->specializations as $spec)
                                            <div>
                                                <div class="flex items-center justify-between mb-2">
                                                    <span class="font-medium text-darki font-dmsans">{{ $spec['area'] ?? '' }}</span>
                                                    @if (! empty($spec['percentage']))
                                                        <span class="text-golden font-dmsans">{{ $spec['percentage'] }}%</span>
                                                    @endif
                                                </div>
                                                @if (! empty($spec['percentage']))
                                                    <div class="w-full h-2 overflow-hidden bg-softGrey">
                                                        <div class="h-full transition-all duration-500 bg-golden"
                                                             style="width: {{ min(100, max(0, (int) $spec['percentage'])) }}%"></div>
                                                    </div>
                                                @endif
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            </section>
                        </x-shared.motion-wrapper>
                    @endif

                    {{-- Contact CTA --}}
                    <x-shared.motion-wrapper :delay="0.8">
                        <section class="p-6 bg-darki lg:p-8">
                            <h2 class="mb-4 text-xl font-bold text-whiteki font-prata lg:text-2xl">¿Necesitas Asesoría Legal?</h2>
                            <p class="mb-6 text-graykiSecondary font-dmsans">
                                Agenda una consulta para discutir tu caso con nuestro equipo de expertos.
                            </p>
                            <x-shared.main-button :href="route('contact')" class="justify-center w-full">
                                Agendar Consulta
                            </x-shared.main-button>
                        </section>
                    </x-shared.motion-wrapper>
                </div>
            </div>
        </div>
    </div>
</x-layouts.app>
