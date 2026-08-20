@props(['delay' => 0])

{{--
    Scroll/entry reveal replacing the Framer Motion <MotionWrapper>.
    Fades and slides content up; honors prefers-reduced-motion (see app.css).
    `delay` is in seconds, matching the old API.
--}}
<div class="motion-reveal" style="animation-delay: {{ $delay }}s">
    {{ $slot }}
</div>
