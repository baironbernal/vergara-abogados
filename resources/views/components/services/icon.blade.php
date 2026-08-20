@props(['id' => 0])

{{--
    Picks a stable icon for a service from its id, mirroring getServiceIcon()
    in the old CardService.jsx — same list, same order, so every service keeps
    the icon it had in the React build.
--}}
@php
    $serviceIcons = [
        'scale', 'home', 'file-text', 'users', 'shield', 'building', 'gavel',
        'handshake', 'briefcase', 'landmark', 'file-check', 'user-check',
        'dollar-sign', 'map-pin', 'phone', 'mail', 'calendar', 'clock',
        'check-circle', 'star', 'award', 'target', 'zap',
    ];
@endphp

<x-lucide :name="$serviceIcons[$id % count($serviceIcons)]" {{ $attributes }} />
