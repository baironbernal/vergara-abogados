@props(['styles' => null, 'corporativeInfo' => null])

@php
    $email    = $corporativeInfo?->corporative_email    ?? 'admin@inmobiliariavergarayabogados.com';
    $phone    = $corporativeInfo?->corporative_whatsapp  ?? '+57 323-3344-34';
    $linkedin = $corporativeInfo?->corporative_linkedin;
    $instagram= $corporativeInfo?->corporative_instagram;
    $facebook = $corporativeInfo?->corporative_facebook;
    $twitter  = $corporativeInfo?->corporative_twitter;
@endphp

<header class="{{ $styles }}" style="height: var(--info-top-height)">
    <div class="container flex-col items-center justify-end hidden gap-4 py-4 mx-auto text-xs text-grayki md:flex md:flex-row">
        <p class="flex gap-2 px-3 text-gray-300 border-r border-greyki">
            {{-- mail --}}
            <svg class="w-4 h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            {{ $email }}
        </p>

        <p class="flex gap-2 px-3 text-gray-300 border-r border-greyki">
            {{-- phone --}}
            <svg class="w-4 h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            {{ $phone }}
        </p>

        <div class="flex space-x-3">
            @if ($facebook)
                <a href="{{ $facebook }}" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <svg class="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </a>
            @endif
            @if ($twitter)
                <a href="{{ $twitter }}" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <svg class="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                </a>
            @endif
            @if ($instagram)
                <a href="{{ $instagram }}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg class="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
            @endif
            @if ($linkedin)
                <a href="{{ $linkedin }}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <svg class="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S.02 4.881.02 3.5C.02 2.12 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8h4.52v14H.24V8zm7.5 0h4.33v1.91h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V22h-4.52v-6.72c0-1.6-.03-3.66-2.23-3.66-2.23 0-2.57 1.74-2.57 3.54V22H7.74V8z"/></svg>
                </a>
            @endif
        </div>
    </div>
</header>
