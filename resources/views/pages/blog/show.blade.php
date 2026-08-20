@php
    $shareUrl = url()->current();

    $socialLinks = [
        ['name' => 'Facebook', 'icon' => 'facebook', 'url' => 'https://www.facebook.com/sharer/sharer.php?u=' . urlencode($shareUrl)],
        ['name' => 'Twitter',  'icon' => 'twitter',  'url' => 'https://twitter.com/intent/tweet?text=' . urlencode($blog->title) . '&url=' . urlencode($shareUrl)],
        ['name' => 'LinkedIn', 'icon' => 'linkedin', 'url' => 'https://www.linkedin.com/sharing/share-offsite/?url=' . urlencode($shareUrl)],
    ];
@endphp

<x-layouts.app>
    <div class="min-h-screen bg-whiteki">
        {{-- Back navigation --}}
        <div class="bg-white border-b border-softGrey">
            <div class="px-4 py-4 mx-auto max-w-7xl">
                <a href="{{ route('blog.index') }}" wire:navigate
                   class="inline-flex items-center transition-colors duration-200 text-greyki hover:text-golden font-dmsans">
                    <x-lucide name="arrow-left" class="w-4 h-4 mr-2 lg:w-5 lg:h-5" />
                    Volver al Blog
                </a>
            </div>
        </div>

        <article class="max-w-4xl px-4 py-8 mx-auto lg:py-12">
            {{-- Header --}}
            <x-shared.motion-wrapper>
                <header class="mb-8 text-center lg:mb-12">
                    <h1 class="mb-4 text-2xl font-bold leading-tight text-darki font-prata sm:text-3xl md:text-4xl lg:text-5xl">
                        {{ $blog->title }}
                    </h1>

                    <div class="flex flex-col items-center justify-center gap-3 mb-6 text-greyki sm:flex-row sm:gap-6 lg:mb-8">
                        <div class="flex items-center">
                            <x-lucide name="user" class="w-4 h-4 mr-2 text-golden lg:w-5 lg:h-5" />
                            <span class="text-sm font-dmsans lg:text-base">{{ $blog->user?->name }}</span>
                        </div>

                        <div class="flex items-center">
                            <x-lucide name="calendar" class="w-4 h-4 mr-2 text-golden lg:w-5 lg:h-5" />
                            <time datetime="{{ $blog->published_at?->toDateString() }}" class="text-sm font-dmsans lg:text-base">
                                {{ $blog->published_at?->translatedFormat('j \d\e F \d\e Y') }}
                            </time>
                        </div>

                        <div class="flex items-center">
                            <x-lucide name="clock" class="w-4 h-4 mr-2 text-golden lg:w-5 lg:h-5" />
                            <span class="text-sm font-dmsans lg:text-base">{{ $blog->reading_time }} min de lectura</span>
                        </div>
                    </div>

                    {{-- Social share --}}
                    <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
                        <span class="text-sm font-medium text-darki font-dmsans">Compartir:</span>
                        <div class="flex gap-2 lg:gap-3">
                            @foreach ($socialLinks as $social)
                                <a href="{{ $social['url'] }}" target="_blank" rel="noopener noreferrer"
                                   aria-label="Compartir en {{ $social['name'] }}"
                                   class="flex items-center justify-center w-8 h-8 transition-colors duration-200 border-2 border-golden text-golden hover:bg-golden hover:text-whiteki lg:w-10 lg:h-10">
                                    <x-lucide :name="$social['icon']" class="w-4 h-4 lg:w-5 lg:h-5" />
                                </a>
                            @endforeach
                        </div>
                    </div>
                </header>
            </x-shared.motion-wrapper>

            {{-- Featured image --}}
            @if ($blog->featured_image)
                <x-shared.motion-wrapper>
                    <div class="mb-8 lg:mb-12">
                        <img src="/storage/{{ $blog->featured_image }}" alt="{{ $blog->title }}"
                             class="object-cover w-full h-48 rounded-lg sm:h-64 lg:h-80">
                    </div>
                </x-shared.motion-wrapper>
            @endif

            {{-- Content — sanitized server-side, replacing DOMPurify (§10). --}}
            <x-shared.motion-wrapper>
                <x-shared.rich-text :html="$blog->content"
                                    class="text-base leading-relaxed text-greyki font-dmsans lg:text-lg" />
            </x-shared.motion-wrapper>

            {{-- Related articles --}}
            @if ($relatedBlogs->isNotEmpty())
                <x-shared.motion-wrapper>
                    <section class="mt-12 lg:mt-16">
                        <h2 class="mb-6 text-2xl font-bold text-darki font-prata lg:mb-8 lg:text-3xl">
                            Artículos Relacionados
                        </h2>

                        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            @foreach ($relatedBlogs as $relatedBlog)
                                <x-blog.card :blog="$relatedBlog" :showAuthor="false" />
                            @endforeach
                        </div>
                    </section>
                </x-shared.motion-wrapper>
            @endif

            {{-- Back to blog --}}
            <x-shared.motion-wrapper>
                <div class="mt-12 text-center lg:mt-16">
                    <x-shared.main-button :href="route('blog.index')" class="inline-flex px-8 py-3 shadow-lg lg:px-10 lg:py-4">
                        Volver al Blog
                    </x-shared.main-button>
                </div>
            </x-shared.motion-wrapper>
        </article>
    </div>
</x-layouts.app>
