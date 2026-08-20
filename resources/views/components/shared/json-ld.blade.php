{{--
    Renders JSON-LD structured data registered on SeoManager by the controller.
    Server-rendered into <head>, replacing the React <JsonLd> component.
--}}
@php $schema = \App\Services\SeoManager::schema(); @endphp

@if ($schema)
    @if (is_array($schema) && array_is_list($schema) && count($schema) > 1)
        @foreach ($schema as $single)
            <script type="application/ld+json">{!! json_encode($single, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
        @endforeach
    @else
        <script type="application/ld+json">{!! json_encode(is_array($schema) && array_is_list($schema) ? $schema[0] : $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
    @endif
@endif
