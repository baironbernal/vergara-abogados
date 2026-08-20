{{--
    The LegalService + RealEstateAgent schema is registered by HomeController and
    rendered into <head> by <x-shared.json-ld>. The React page also duplicated it
    in the body; that duplicate is intentionally gone.
--}}
<x-layouts.app>
    <x-home.main-banner :homeBanner="$homeBanner" />
    <x-home.lawyers-section :lawyers="$lawyers" />
</x-layouts.app>
