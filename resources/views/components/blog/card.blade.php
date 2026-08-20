@props(['blog', 'showAuthor' => true])

{{--
    Article card used by the blog listing and by the "Artículos Relacionados"
    strip on a post. The related strip omits the author/reading-time row,
    matching the old React markup.
--}}
<article class="overflow-hidden transition-all duration-300 bg-white border shadow-lg border-softGrey hover:shadow-xl hover:scale-[1.02]">
    <div class="relative">
        <img src="{{ $blog->featured_image ? '/storage/' . $blog->featured_image : '/placeholder.svg' }}"
             alt="{{ $blog->title }}"
             loading="lazy"
             class="object-cover w-full h-40 sm:h-48">
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>

    <div class="p-4 lg:p-6">
        <h3 class="mb-2 text-lg font-medium line-clamp-2 text-darki font-prata lg:mb-3 lg:text-xl">
            {{ $blog->title }}
        </h3>

        <p class="mb-3 text-sm text-greyki line-clamp-3 font-dmsans lg:mb-4 lg:text-base">
            {{ $blog->excerpt }}
        </p>

        @if ($showAuthor)
            <div class="flex items-center justify-between mb-3 text-xs text-greyki lg:mb-4 lg:text-sm">
                <div class="flex items-center">
                    <x-lucide name="user" class="w-3 h-3 mr-1 text-golden lg:w-4 lg:h-4 lg:mr-2" />
                    <span class="font-dmsans">{{ $blog->user?->name }}</span>
                </div>
                <div class="flex items-center">
                    <x-lucide name="clock" class="w-3 h-3 mr-1 text-golden lg:w-4 lg:h-4 lg:mr-2" />
                    <span class="font-dmsans">{{ $blog->reading_time }} min</span>
                </div>
            </div>
        @endif

        <div class="flex items-center justify-between">
            <div class="flex items-center text-xs text-greyki lg:text-sm">
                <x-lucide name="calendar" class="w-3 h-3 mr-1 text-golden lg:w-4 lg:h-4 lg:mr-2" />
                <time datetime="{{ $blog->published_at?->toDateString() }}" class="font-dmsans">
                    {{ $blog->published_at?->translatedFormat('j \d\e F \d\e Y') }}
                </time>
            </div>

            <a href="{{ route('blog.show', $blog->slug) }}" wire:navigate
               class="inline-flex items-center px-3 py-1 text-xs transition-colors duration-200 bg-golden text-whiteki hover:bg-darki font-dmsans lg:px-4 lg:py-2 lg:text-sm">
                Leer más
                <x-lucide name="arrow-right" class="w-3 h-3 ml-1 lg:w-4 lg:h-4 lg:ml-2" />
            </a>
        </div>
    </div>
</article>
