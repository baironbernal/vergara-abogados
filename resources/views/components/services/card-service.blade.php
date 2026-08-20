@props(['service'])

<a href="{{ route('service.show', $service->slug ?: $service->id) }}" wire:navigate class="block h-full">
    <article class="flex flex-col items-center justify-between h-full min-h-[320px] p-8 text-center transition-all duration-300 border cursor-pointer border-softGrey hover:shadow-lg hover:border-golden hover:scale-105 lg:p-16 lg:min-h-[380px] group">
        <div class="flex flex-col items-center flex-grow">
            <div class="transition-colors duration-300 group-hover:text-golden">
                <x-services.icon :id="$service->id" class="w-16 h-16 text-golden lg:w-20 lg:h-20" />
            </div>

            <h3 class="mt-4 text-lg font-semibold tracking-wider text-gray-800 transition-colors duration-300 font-prata lg:text-xl group-hover:text-golden">
                {{ $service->name }}
            </h3>

            {{-- 3-line clamp, matching the inline -webkit-line-clamp styles of the old card. --}}
            <p class="flex items-center justify-center flex-grow mt-2 text-sm text-greyki lg:text-base"
               style="display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; text-overflow:ellipsis; line-height:1.4; min-height:4.2em;">
                {{ $service->description }}
            </p>
        </div>

        <div class="p-3 mx-auto mt-4 transition-colors duration-300 bg-softGrey group-hover:bg-golden lg:p-4 lg:mt-6">
            <x-lucide name="arrow-right" class="w-6 h-6 transition-colors duration-300 text-golden group-hover:text-white" />
        </div>
    </article>
</a>
