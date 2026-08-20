@php
    $field = 'w-full px-3 py-2 text-sm transition-all duration-200 bg-transparent border-2 border-golden focus:outline-none focus:border-blueki placeholder:text-greyki font-dmsans';
    $err = 'mt-1 text-xs text-red-600 font-dmsans';
@endphp

<section class="w-full h-full max-w-3xl">
    {{-- Step indicator --}}
    <ol class="flex items-center gap-2 mb-8 text-xs font-dmsans" aria-label="Progreso">
        @foreach (['Tus datos', 'Elige horario', 'Confirmación'] as $i => $label)
            @php $n = $i + 1; @endphp
            <li class="flex items-center gap-2 {{ $step >= $n ? 'text-golden' : 'text-graykiSecondary' }}"
                @if ($step === $n) aria-current="step" @endif>
                <span class="flex items-center justify-center w-6 h-6 border-2 rounded-full
                             {{ $step >= $n ? 'border-golden bg-golden text-white' : 'border-graykiSecondary' }}">
                    {{ $n }}
                </span>
                <span class="hidden sm:inline">{{ $label }}</span>
                @if (! $loop->last)
                    <span class="w-6 h-px sm:w-10 {{ $step > $n ? 'bg-golden' : 'bg-graykiSecondary' }}"></span>
                @endif
            </li>
        @endforeach
    </ol>

    {{-- ───────────────── Step 1 — personal details ───────────────── --}}
    @if ($step === 1)
        <div class="w-full max-w-4xl mx-auto 2xl:max-w-6xl">
            <form wire:submit="saveAndContinue" class="space-y-6">
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-darki font-dmsans">Información Personal</h3>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label for="cf-name" class="block mb-1 text-sm font-medium text-darki font-dmsans">Nombre completo *</label>
                            <input id="cf-name" type="text" wire:model="name" placeholder="Ingresa tu nombre completo" class="{{ $field }}">
                            @error('name') <p class="{{ $err }}">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label for="cf-email" class="block mb-1 text-sm font-medium text-darki font-dmsans">Correo electrónico *</label>
                            <input id="cf-email" type="email" wire:model="email" placeholder="tu@email.com" class="{{ $field }}">
                            @error('email') <p class="{{ $err }}">{{ $message }}</p> @enderror
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label for="cf-phone" class="block mb-1 text-sm font-medium text-darki font-dmsans">Teléfono *</label>
                            <input id="cf-phone" type="tel" wire:model="phone" placeholder="+57 300 123 4567" class="{{ $field }}">
                            @error('phone') <p class="{{ $err }}">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label for="cf-lawyer" class="block mb-1 text-sm font-medium text-darki font-dmsans">Abogado preferido</label>
                            <select id="cf-lawyer" wire:model.live="lawyer_id" class="{{ $field }} text-darki">
                                <option value="">Selecciona un abogado</option>
                                <option value="cualquiera">Cualquiera disponible</option>
                                @foreach ($lawyers as $lawyer)
                                    <option value="{{ $lawyer->id }}">{{ $lawyer->name }} - {{ $lawyer->profession ?: 'Abogado' }}</option>
                                @endforeach
                            </select>
                            @error('lawyer_id') <p class="{{ $err }}">{{ $message }}</p> @enderror
                        </div>
                    </div>
                </div>

                <div class="space-y-3">
                    <h3 class="text-lg font-semibold text-darki font-dmsans">Detalles del Caso</h3>

                    <div>
                        <label for="cf-observations" class="block mb-1 text-sm font-medium text-darki font-dmsans">Cuéntanos tu situación *</label>
                        <textarea id="cf-observations" wire:model="observations" rows="4" maxlength="2000"
                                  placeholder="Describe brevemente tu caso o consulta legal..."
                                  class="{{ $field }} resize-none"></textarea>
                        @error('observations') <p class="{{ $err }}">{{ $message }}</p> @enderror
                    </div>
                </div>

                <div class="space-y-3">
                    <div class="flex items-start gap-3 p-4 bg-softGrey/20">
                        <input id="cf-agree" type="checkbox" wire:model="agree"
                               class="w-4 h-4 mt-1 border-2 text-golden border-golden focus:ring-golden">
                        <div>
                            <label for="cf-agree" class="text-sm font-medium cursor-pointer text-darki font-dmsans">
                                Acepto la política de privacidad *
                            </label>
                            <p class="mt-1 text-xs text-greyki font-dmsans">
                                Al enviar este formulario, aceptas que procesemos tu información de acuerdo con nuestra política de privacidad.
                            </p>
                        </div>
                    </div>
                    @error('agree') <p class="{{ $err }}">{{ $message }}</p> @enderror
                </div>

                <div class="pt-4">
                    <x-shared.main-button type="submit" class="w-full justify-center py-3 text-base font-semibold"
                                          wire:loading.attr="disabled" wire:target="saveAndContinue">
                        <span wire:loading.remove wire:target="saveAndContinue">Enviar Solicitud</span>
                        <span wire:loading wire:target="saveAndContinue">Enviando...</span>
                    </x-shared.main-button>
                </div>
            </form>
        </div>
    @endif

    {{-- ───────────────── Step 2 — slot picker ───────────────── --}}
    @if ($step === 2)
        <div class="text-[13px]">
            <div class="p-4 mb-6 border bg-golden/10 border-golden">
                <h3 class="mb-2 font-medium text-darki font-dmsans">Instrucciones:</h3>
                <p class="text-sm text-greyki font-dmsans">
                    Selecciona el horario que prefieras. Los espacios en negro están ocupados
                    y los espacios en rojo no están disponibles.
                </p>
            </div>

            @error('selectedStart')
                <div class="p-4 mb-4 text-sm text-red-600 border border-red-200 bg-red-50 font-dmsans">{{ $message }}</div>
            @enderror

            {{-- Week navigation --}}
            <div class="flex items-center justify-between mb-4">
                <button type="button" wire:click="previousWeek" @disabled(! $this->canGoToPreviousWeek())
                        class="flex items-center gap-1 px-3 py-2 text-sm transition-colors border border-graykiSecondary text-darki hover:bg-softGrey disabled:opacity-40 disabled:cursor-not-allowed font-dmsans">
                    <x-lucide name="chevron-left" class="w-4 h-4" />
                    Semana anterior
                </button>

                <span class="text-sm font-medium text-darki font-dmsans">
                    {{ \Illuminate\Support\Carbon::parse($weekStart)->translatedFormat('j M') }}
                    –
                    {{ \Illuminate\Support\Carbon::parse($weekStart)->addDays(4)->translatedFormat('j M Y') }}
                </span>

                <button type="button" wire:click="nextWeek"
                        class="flex items-center gap-1 px-3 py-2 text-sm transition-colors border border-graykiSecondary text-darki hover:bg-softGrey font-dmsans">
                    Semana siguiente
                    <x-lucide name="chevron-right" class="w-4 h-4" />
                </button>
            </div>

            {{-- Legend --}}
            <div class="flex flex-wrap gap-4 mb-4 text-xs text-greyki font-dmsans">
                <span class="flex items-center gap-2"><span class="inline-block w-3 h-3 border border-golden"></span>Disponible</span>
                <span class="flex items-center gap-2"><span class="inline-block w-3 h-3 bg-black"></span>Ocupado</span>
                <span class="flex items-center gap-2"><span class="inline-block w-3 h-3 bg-red-600"></span>No disponible</span>
                <span class="flex items-center gap-2"><span class="inline-block w-3 h-3 bg-golden"></span>Tu selección</span>
            </div>

            {{-- Week grid --}}
            <div class="overflow-x-auto">
                <div class="grid grid-cols-5 gap-2 min-w-[640px]">
                    @foreach ($this->weekGrid as $day)
                        <div>
                            <div class="pb-2 mb-2 text-sm font-medium text-center capitalize border-b text-darki border-softGrey font-dmsans">
                                {{ $day['label'] }}
                            </div>

                            <div class="space-y-1">
                                @foreach ($day['slots'] as $slot)
                                    @php
                                        $disabled = $slot['past'] || $slot['occupied'] || $slot['blocked'];
                                        $classes = match (true) {
                                            $slot['selected'] => 'bg-golden text-white border-golden',
                                            $slot['blocked'] => 'bg-red-600 text-white border-red-700 cursor-not-allowed',
                                            $slot['occupied'] => 'bg-black text-white border-black cursor-not-allowed',
                                            $slot['past'] => 'bg-softGrey text-graykiSecondary border-softGrey cursor-not-allowed',
                                            default => 'bg-white text-darki border-golden hover:bg-golden hover:text-white',
                                        };
                                    @endphp

                                    <button type="button"
                                            @if (! $disabled) wire:click="selectSlot('{{ $slot['start'] }}')" @endif
                                            @disabled($disabled)
                                            @if ($slot['occupied'] || $slot['blocked'])
                                                title="{{ $slot['lawyer'] ?? 'Abogado' }} — {{ $slot['blocked'] ? 'No disponible' : 'Ocupado' }}"
                                            @endif
                                            class="w-full px-1 py-1.5 text-xs transition-colors border font-dmsans {{ $classes }}">
                                        {{ $slot['label'] }}
                                    </button>
                                @endforeach
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            {{-- Selection confirmation --}}
            @if ($selectedStart !== '')
                <div id="confirmation-section" class="p-6 mt-6 bg-white border shadow-lg border-softGrey">
                    <h3 class="mb-4 text-lg font-medium text-darki font-dmsans">Confirmar Reserva</h3>

                    <div class="mb-4">
                        <p class="text-greyki font-dmsans"><strong>Fecha y hora seleccionada:</strong></p>
                        <p class="text-lg capitalize text-darki font-dmsans">
                            {{ \Illuminate\Support\Carbon::parse($selectedStart)->translatedFormat('l j \d\e F \d\e Y, g:i a') }}
                        </p>
                        <p class="text-greyki font-dmsans">
                            <strong>Hasta:</strong> {{ \Illuminate\Support\Carbon::parse($selectedEnd)->format('g:i a') }}
                        </p>
                    </div>

                    <div class="flex gap-4">
                        <button type="button" wire:click="confirmReservation"
                                wire:loading.attr="disabled" wire:target="confirmReservation"
                                class="px-6 py-3 font-medium transition-colors duration-300 bg-golden text-whiteki hover:bg-darki disabled:bg-graykiSecondary font-dmsans">
                            <span wire:loading.remove wire:target="confirmReservation">Confirmar Reserva</span>
                            <span wire:loading wire:target="confirmReservation">Confirmando...</span>
                        </button>
                        <button type="button" wire:click="clearSlot"
                                class="px-6 py-3 font-medium transition-colors duration-300 border border-graykiSecondary text-darki hover:bg-softGrey font-dmsans">
                            Cancelar
                        </button>
                    </div>
                </div>
            @endif

            <div class="mt-6">
                <button type="button" wire:click="back"
                        class="px-6 py-3 font-medium transition-colors duration-300 border border-graykiSecondary text-darki hover:bg-softGrey font-dmsans">
                    Volver
                </button>
            </div>
        </div>
    @endif

    {{-- ───────────────── Step 3 — confirmation ───────────────── --}}
    @if ($step === 3)
        <div class="text-center">
            <div class="max-w-md mx-auto">
                <div class="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full">
                    <x-lucide name="check-circle" class="w-8 h-8 text-green-600" />
                </div>

                <h2 class="mb-4 text-2xl font-medium text-darki font-prata">¡Gracias por tu reserva!</h2>
                <p class="mb-6 text-lg text-greyki font-dmsans">Estaremos contactando contigo pronto</p>

                @if ($summary)
                    <div class="p-6 text-left border bg-whiteki border-softGrey">
                        <h3 class="mb-3 font-medium text-darki font-dmsans">Datos de tu reserva:</h3>
                        <div class="space-y-2 text-sm text-greyki font-dmsans">
                            <p><strong>Nombre:</strong> {{ $summary['name'] }}</p>
                            <p><strong>Email:</strong> {{ $summary['email'] }}</p>
                            <p><strong>Teléfono:</strong> {{ $summary['phone'] }}</p>
                            @if ($summary['lawyer'])
                                <p><strong>Abogado seleccionado:</strong> {{ $summary['lawyer'] }}</p>
                            @endif
                            <p class="capitalize"><strong>Fecha:</strong> {{ $summary['starts_at'] }} – {{ $summary['ends_at'] }}</p>
                            @if ($summary['observations'])
                                <p><strong>Observaciones:</strong> {{ $summary['observations'] }}</p>
                            @endif
                        </div>
                    </div>
                @endif

                <div class="mt-8">
                    <a href="{{ route('home') }}" wire:navigate
                       class="inline-block px-8 py-3 font-medium transition-colors duration-300 bg-golden text-whiteki hover:bg-darki font-dmsans">
                        Volver al Inicio
                    </a>
                </div>
            </div>
        </div>
    @endif
</section>
