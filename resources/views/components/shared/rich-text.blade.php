@props(['html' => null])

{{--
    Prints admin-authored rich text (blog content, lawyer bio) after a
    server-side HTMLPurifier pass. This is the replacement for the DOMPurify
    call React used to make at render time — see MIGRATION.md §10.

    Never print that content with a bare {!! !!}; always go through here.
--}}
@if (filled($html))
    <div {{ $attributes->class(['max-w-none prose prose-lg']) }}>
        {!! clean($html, 'richtext') !!}
    </div>
@endif
