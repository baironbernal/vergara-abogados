<?php

namespace App\Http\Controllers;

use App\Models\Lawyer;
use App\Services\SeoManager;

class LawyerController extends Controller
{
    public function show(Lawyer $lawyer)
    {
        $seo = [
            'title' => $lawyer->name.' — Abogado en Soacha, Cundinamarca | Inmobiliaria Vergara',
            'description' => $lawyer->description
                ?: 'Perfil profesional de '.$lawyer->name.', '.$lawyer->profession
                   .' especializado en derecho inmobiliario en Soacha, Cundinamarca.',
            'keywords' => 'abogado Soacha, '.strtolower($lawyer->profession).', '
                           .strtolower($lawyer->name).', servicios legales Soacha, asesoría legal Cundinamarca',
        ];

        SeoManager::set($seo);

        SeoManager::setSchema([
            '@context' => 'https://schema.org',
            '@type' => 'Attorney',
            'name' => $lawyer->name,
            'description' => $seo['description'],
            'url' => url("/abogados/{$lawyer->slug}"),
            'image' => $lawyer->image ? asset("storage/{$lawyer->image}") : null,
            'jobTitle' => $lawyer->profession,
            'worksFor' => [
                '@type' => 'LegalService',
                'name' => 'Inmobiliaria Vergara y Abogados',
                'address' => [
                    '@type' => 'PostalAddress',
                    'addressLocality' => 'Soacha',
                    'addressRegion' => 'Cundinamarca',
                    'addressCountry' => 'CO',
                ],
            ],
            'alumniOf' => collect($lawyer->education ?? [])->map(fn ($e) => [
                '@type' => 'EducationalOrganization',
                'name' => is_array($e) ? ($e['institution'] ?? $e['title'] ?? '') : $e,
            ])->filter(fn ($e) => $e['name'])->values()->all(),
            'knowsAbout' => $lawyer->specializations ?? [],
            'sameAs' => array_filter([
                $lawyer->linkedin,
                $lawyer->facebook,
                $lawyer->twitter,
                $lawyer->instagram,
            ]),
        ]);

        // The Blade view reads the model directly; the Attorney schema above is
        // rendered into <head> by <x-shared.json-ld>.
        return view('pages.lawyers.show', [
            'lawyer' => $lawyer,
            'seo' => $seo,
        ]);
    }
}
