<?php

namespace App\Http\Controllers;

use App\Models\Lawyer;
use App\Models\Page;
use App\Models\Service;
use App\Services\SeoManager;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $page = cache()->remember('page_seo_/servicios', now()->addDay(), fn () => Page::where('route', '/servicios')->first()
        );
        $seo = $page ? $page->seo : [
            'title' => 'Servicios Legales Inmobiliarios en Soacha — Inmobiliaria Vergara y Abogados',
            'description' => 'Servicios jurídicos especializados en derecho inmobiliario en Soacha, Cundinamarca. Contratos, escrituras, litigios, asesoría de compra y venta de propiedades.',
            'keywords' => 'servicios legales Soacha, derecho inmobiliario Cundinamarca, abogados contratos Soacha, escrituras Soacha, asesoría jurídica inmobiliaria',
        ];

        SeoManager::set($seo);

        return Inertia::render('Services', [
            'services' => Service::all(['id', 'name', 'slug', 'category', 'subcategory', 'description', 'type']),
            'lawyers' => Lawyer::whereNotNull('user_id')->get(['id', 'name', 'slug', 'image', 'profession']),
            'seo' => $seo,
        ]);
    }

    public function show(Service $service)
    {
        // Get SEO from Service model or fallback to default
        $seo = $service->seo ?: [
            'title' => $service->name.' - Servicios Legales Inmobiliarios - Inmobiliaria Vergara',
            'description' => $service->description ?: 'Servicio legal especializado en '.$service->category.'. Asesoría profesional y experta en derecho inmobiliario.',
            'keywords' => strtolower($service->name).', '.strtolower($service->category).', servicios legales, derecho inmobiliario, asesoría jurídica',
        ];

        $breadcrumbSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => [
                ['@type' => 'ListItem', 'position' => 1, 'name' => 'Inicio', 'item' => url('/')],
                ['@type' => 'ListItem', 'position' => 2, 'name' => 'Servicios', 'item' => url('/servicios')],
                ['@type' => 'ListItem', 'position' => 3, 'name' => $service->name],
            ],
        ];

        SeoManager::set($seo);
        SeoManager::setSchema($breadcrumbSchema);

        if (! empty($service->faq)) {
            $faqSchema = [
                '@context' => 'https://schema.org',
                '@type' => 'FAQPage',
                'mainEntity' => collect($service->faq)->map(function ($item) {
                    return [
                        '@type' => 'Question',
                        'name' => $item['question'] ?? '',
                        'acceptedAnswer' => [
                            '@type' => 'Answer',
                            'text' => $item['answer'] ?? '',
                        ],
                    ];
                })->values()->all(),
            ];
            SeoManager::setSchema($faqSchema);
        }

        $relatedLawyers = Lawyer::whereNotNull('user_id')
            ->get(['id', 'name', 'slug', 'image', 'profession']);

        return Inertia::render('ServiceDetail', [
            'service' => $service,
            'lawyers' => $relatedLawyers,
            'seo' => $seo,
            'schema' => SeoManager::schema(),
        ]);
    }
}
