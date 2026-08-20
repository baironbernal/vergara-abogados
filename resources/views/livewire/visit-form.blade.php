@php
    $field = 'w-full px-4 py-3 border transition-all duration-200 font-dmsans focus:outline-none focus:ring-2 focus:ring-golden';
    $ok = 'border-graykiSecondary focus:border-golden';
    $bad = 'border-red-300 focus:border-red-300';
@endphp

<div>
    {{-- Trigger --}}
    <x-shared.main-button type="button" wire:click="openForm" class="justify-center w-full py-3 text-base lg:py-4 lg:text-lg">
        Agendar Visita
    </x-shared.main-button>

    @if ($open)
        <div class="fixed inset-0 z-50 flex items-center justify-center"
             x-data
             @keydown.escape.window="$wire.closeForm()"
             role="dialog" aria-modal="true" aria-labelledby="visit-form-title">
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" wire:click="closeForm"></div>

            @if ($submitted)
                {{-- Confirmation --}}
                <div class="relative z-10 w-full max-w-md p-8 mx-4 text-center bg-white shadow-2xl">
                    <div class="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full">
                        <x-lucide name="check-circle" class="w-8 h-8 text-green-600" />
                    </div>

                    <h2 id="visit-form-title" class="mb-4 text-2xl font-medium text-darki font-prata">¡Visita Agendada!</h2>

                    <p class="mb-6 text-lg text-greyki font-dmsans">
                        Nos contactaremos contigo pronto para confirmar los detalles.
                    </p>

                    <div class="p-4 text-left border rounded bg-softGrey/20 border-softGrey">
                        <h3 class="mb-3 font-medium text-darki font-dmsans">Detalles de tu visita:</h3>
                        <div class="space-y-2 text-sm text-greyki font-dmsans">
                            <p><strong>Propiedad:</strong> {{ $property->name }}</p>
                            <p><strong>Fecha:</strong> {{ \Illuminate\Support\Carbon::parse($confirmedDate)->format('d/m/Y') }}</p>
                            <p><strong>Hora:</strong> {{ $confirmedTime }}</p>
                        </div>
                    </div>

                    <button type="button" wire:click="closeForm"
                            class="mt-6 text-sm underline transition-colors text-greyki hover:text-darki font-dmsans">
                        Cerrar
                    </button>
                </div>
            @else
                {{-- Form --}}
                <div class="relative z-10 w-full max-w-2xl max-h-[90vh] mx-4 bg-white shadow-2xl overflow-hidden">
                    <div class="flex items-center justify-between p-6 border-b border-softGrey">
                        <div>
                            <h2 id="visit-form-title" class="text-2xl font-bold text-darki font-prata">Agendar Visita</h2>
                            <p class="text-greyki font-dmsans">{{ $property->name }}</p>
                        </div>
                        <button type="button" wire:click="closeForm" aria-label="Cerrar"
                                class="p-2 transition-colors duration-200 rounded text-greyki hover:text-darki hover:bg-softGrey">
                            <x-lucide name="x" class="w-6 h-6" />
                        </button>
                    </div>

                    <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                        <form wire:submit="submit" class="space-y-6">
                            {{-- Personal information --}}
                            <div class="space-y-4">
                                <h3 class="flex items-center gap-2 text-lg font-medium text-darki font-dmsans">
                                    <x-lucide name="user" class="w-5 h-5 text-golden" />
                                    Información Personal
                                </h3>

                                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label for="visit-name" class="block mb-2 text-sm font-medium text-darki font-dmsans">Nombre completo *</label>
                                        <input id="visit-name" type="text" wire:model="name" placeholder="Tu nombre completo"
                                               class="{{ $field }} @error('name') {{ $bad }} @else {{ $ok }} @enderror">
                                        @error('name') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                                    </div>

                                    <div>
                                        <label for="visit-phone" class="block mb-2 text-sm font-medium text-darki font-dmsans">Teléfono *</label>
                                        <input id="visit-phone" type="tel" wire:model="phone" placeholder="+57 300 123 4567"
                                               class="{{ $field }} @error('phone') {{ $bad }} @else {{ $ok }} @enderror">
                                        @error('phone') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                                    </div>
                                </div>

                                <div>
                                    <label for="visit-email" class="block mb-2 text-sm font-medium text-darki font-dmsans">Correo electrónico *</label>
                                    <input id="visit-email" type="email" wire:model="email" placeholder="tu@email.com"
                                           class="{{ $field }} @error('email') {{ $bad }} @else {{ $ok }} @enderror">
                                    @error('email') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                                </div>
                            </div>

                            {{-- Visit information --}}
                            <div class="space-y-4">
                                <h3 class="flex items-center gap-2 text-lg font-medium text-darki font-dmsans">
                                    <x-lucide name="calendar" class="w-5 h-5 text-golden" />
                                    Información de la Visita
                                </h3>

                                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label for="visit-date" class="block mb-2 text-sm font-medium text-darki font-dmsans">Fecha preferida *</label>
                                        <input id="visit-date" type="date" wire:model="visit_date" min="{{ now()->toDateString() }}"
                                               class="{{ $field }} @error('visit_date') {{ $bad }} @else {{ $ok }} @enderror">
                                        @error('visit_date') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                                    </div>

                                    <div>
                                        <label for="visit-time" class="block mb-2 text-sm font-medium text-darki font-dmsans">Hora preferida *</label>
                                        <input id="visit-time" type="time" wire:model="visit_time"
                                               class="{{ $field }} @error('visit_time') {{ $bad }} @else {{ $ok }} @enderror">
                                        @error('visit_time') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                                    </div>
                                </div>

                                <div>
                                    <label for="visit-observations" class="block mb-2 text-sm font-medium text-darki font-dmsans">Observaciones adicionales</label>
                                    <textarea id="visit-observations" wire:model="observations" rows="3" maxlength="1000"
                                              placeholder="¿Hay algo específico que te gustaría saber sobre la propiedad?"
                                              class="{{ $field }} {{ $ok }} resize-none"></textarea>
                                    @error('observations') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                                </div>
                            </div>

                            {{-- Actions --}}
                            <div class="flex flex-col gap-4 pt-6 border-t sm:flex-row border-softGrey">
                                <button type="button" wire:click="closeForm"
                                        class="flex-1 px-6 py-3 font-medium transition-colors duration-300 border border-graykiSecondary text-greyki hover:bg-softGrey font-dmsans">
                                    Cancelar
                                </button>

                                <x-shared.main-button type="submit" class="flex-1 justify-center py-3"
                                                      wire:loading.attr="disabled" wire:target="submit">
                                    <span wire:loading.remove wire:target="submit">Agendar Visita</span>
                                    <span wire:loading wire:target="submit">Enviando...</span>
                                </x-shared.main-button>
                            </div>
                        </form>
                    </div>
                </div>
            @endif
        </div>
    @endif
</div>
