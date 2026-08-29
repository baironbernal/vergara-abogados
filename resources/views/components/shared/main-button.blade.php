@props(['href' => null, 'tag' => 'button'])

@php
    // Render as <a> when an href is provided, otherwise as the given tag.
    $element = $href ? 'a' : $tag;
@endphp

<{{ $element }}
    @if ($href) href="{{ $href }}" wire:navigate @endif
    {{ $attributes->class([
        'relative flex items-center justify-center px-8 py-2 text-lg font-semibold border overflow-hidden',
        'text-white border-softGrey bg-golden group transition-all duration-300 shadow-lg hover:shadow-xl',
    ]) }}
>
    {{-- Content --}}
    <span class="relative z-10 flex items-center transition-colors duration-300 group-hover:text-golden">
        {{ $slot }}
    </span>

    {{-- Overlay animation --}}
    <span class="absolute inset-0 left-0 w-0 transition-all duration-500 ease-out bg-darki group-hover:w-full"></span>
</{{ $element }}>
