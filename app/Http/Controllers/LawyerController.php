<?php

namespace App\Http\Controllers;

use App\Models\Lawyer;
use App\Services\SeoManager;
use Inertia\Inertia;

class LawyerController extends Controller
{
    public function show(Lawyer $lawyer)
    {
        $seo = [
            'title'       => $lawyer->name . ' — Abogado en Soacha, Cundinamarca | Inmobiliaria Vergara',
            'description' => $lawyer->description
                ?: 'Perfil profesional de ' . $lawyer->name . ', ' . $lawyer->profession
                   . ' especializado en derecho inmobiliario en Soacha, Cundinamarca.',
            'keywords'    => 'abogado Soacha, ' . strtolower($lawyer->profession) . ', '
                           . strtolower($lawyer->name) . ', servicios legales Soacha, asesoría legal Cundinamarca',
        ];

        SeoManager::set($seo);

        SeoManager::setSchema([
            '@context'    => 'https://schema.org',
            '@type'       => 'Attorney',
            'name'        => $lawyer->name,
            'description' => $seo['description'],
            'url'         => url("/abogados/{$lawyer->slug}"),
            'image'       => $lawyer->image ? asset("storage/{$lawyer->image}") : null,
            'jobTitle'    => $lawyer->profession,
            'worksFor'    => [
                '@type'   => 'LegalService',
                'name'    => 'Inmobiliaria Vergara y Abogados',
                'address' => [
                    '@type'           => 'PostalAddress',
                    'addressLocality' => 'Soacha',
                    'addressRegion'   => 'Cundinamarca',
                    'addressCountry'  => 'CO',
                ],
            ],
            'alumniOf'   => collect($lawyer->education ?? [])->map(fn ($e) => [
                '@type' => 'EducationalOrganization',
                'name'  => is_array($e) ? ($e['institution'] ?? $e['title'] ?? '') : $e,
            ])->filter(fn ($e) => $e['name'])->values()->all(),
            'knowsAbout' => $lawyer->specializations ?? [],
            'sameAs'     => array_filter([
                $lawyer->linkedin,
                $lawyer->facebook,
                $lawyer->twitter,
                $lawyer->instagram,
            ]),
        ]);

        return Inertia::render('LawyerDetail', [
            'lawyer' => $lawyer->only([
                'id', 'name', 'slug', 'profession', 'title', 'description',
                'bio', 'image', 'specializations', 'education', 'experience',
                'achievements', 'years_experience', 'cases_won',
                'linkedin', 'facebook', 'twitter', 'instagram',
            ]),
            'seo' => $seo,
        ]);
    }
}
