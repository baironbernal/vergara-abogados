@props(['styles' => 'bg-darki text-white/80', 'corporativeInfo' => null])

{{--
    Fixed header: an info top-bar that slides up on scroll (replacing the
    Framer Motion animation from the old React MainHeader) plus the main menu.
--}}
<header
    class="fixed top-0 left-0 z-50 w-full"
    x-data="{
        hideTopBar: false,
        lastScroll: 0,
        init() {
            window.addEventListener('scroll', () => {
                const current = window.scrollY;
                if (current > this.lastScroll && current > 30) {
                    this.hideTopBar = true;
                } else if (current <= 350) {
                    this.hideTopBar = false;
                }
                this.lastScroll = current;
            }, { passive: true });
        }
    }"
>
    <div :style="hideTopBar ? 'transform: translateY(-56px)' : 'transform: translateY(0)'"
         class="transition-transform duration-100 ease-in-out">
        <x-shared.info :styles="$styles" :corporativeInfo="$corporativeInfo" />
        <x-shared.navigation :styles="$styles" />
    </div>
</header>
