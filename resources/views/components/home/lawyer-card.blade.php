@props(['lawyer'])

<a href="{{ route('lawyers.show', $lawyer->slug) }}" wire:navigate
   class="relative block overflow-hidden cursor-pointer group bg-softGrey h-96">
    <div class="relative w-full h-full">
        @if ($lawyer->image)
            <img src="/storage/{{ $lawyer->image }}" alt="{{ $lawyer->name }}"
                 class="object-cover w-full h-full transition-all duration-500 filter grayscale group-hover:grayscale-0">
        @else
            <div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-softGrey to-graykiSecondary">
                <div class="flex items-center justify-center w-32 h-32 text-6xl rounded-full bg-whiteki text-darki font-prata">
                    {{ \Illuminate\Support\Str::substr($lawyer->name, 0, 1) ?: '?' }}
                </div>
            </div>
        @endif

        <div class="absolute bottom-0 left-0 right-0 p-6 overflow-hidden bg-gradient-to-t from-darki/90 via-darki/50 to-transparent">
            <div class="text-left transition-transform duration-500 transform group-hover:-translate-y-20">
                <h3 class="mb-1 text-xl font-light text-whiteki font-prata">{{ $lawyer->name }}</h3>
                <p class="text-sm font-medium text-golden font-dmsans">{{ $lawyer->profession ?? 'Owner, Partner' }}</p>
            </div>

            <div class="absolute text-left transition-transform duration-500 transform translate-y-full bottom-6 left-6 right-6 group-hover:translate-y-0">
                <div class="mb-3 text-sm text-whiteki font-dmsans">
                    <p>Cl. 12 #8 05, Suite 1400</p>
                    <p>Soacha, Cundinamarca 10018</p>
                </div>

                <div class="text-sm text-whiteki font-dmsans">
                    @if ($lawyer->phone)
                        <div class="mb-2">
                            <a href="tel:{{ $lawyer->phone }}" class="transition-colors duration-200 hover:text-golden">{{ $lawyer->phone }}</a>
                        </div>
                    @endif
                    @if ($lawyer->email)
                        <div class="flex items-center space-x-2">
                            <span class="text-greyki">|</span>
                            <button type="button" class="transition-colors duration-200 hover:text-golden">vCard</button>
                            <span class="text-greyki">|</span>
                            <a href="mailto:{{ $lawyer->email }}" class="transition-colors duration-200 hover:text-golden">E-Mail</a>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</a>
