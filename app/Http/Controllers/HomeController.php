<?php

namespace App\Http\Controllers;

use App\Models\HomeBanner;
use App\Models\Information;
use App\Models\Lawyer;
use App\Models\Page;
use App\Services\SeoManager;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $homeBanner = HomeBanner::latest()->first();

        $page = cache()->remember('page_seo_/', now()->addDay(), fn () =>
            Page::where('route', '/')->first()
        );
        $seo = $page ? $page->seo : [
            'title'       => 'Inmobiliaria Vergara y Abogados — Soacha, Cundinamarca | Derecho Inmobiliario',
            'description' => 'Firma de abogados en Soacha, Cundinamarca especializada en derecho inmobiliario. Compra, venta, arriendo y asesoría jurídica de propiedades. ¡Agenda tu cita hoy!',
            'keywords'    => 'abogados Soacha, inmobiliaria Soacha, derecho inmobiliario Cundinamarca, asesoría jurídica Soacha, abogados Cundinamarca, bienes raíces Soacha',
        ];

        SeoManager::set($seo);

        // LocalBusiness + RealEstateAgent — the most important schema for
        // "abogados Soacha" and "inmobiliaria Cundinamarca" local searches.
        $info = cache()->remember('corporative_info', now()->addHours(6), fn () =>
            Information::latest()->first()
        );
        SeoManager::setSchema([
            '@context'    => 'https://schema.org',
            '@type'       => ['LegalService', 'RealEstateAgent'],
            'name'        => 'Inmobiliaria Vergara y Abogados',
            'description' => $seo['description'],
            'url'         => url('/'),
            'logo'        => asset('logo.png'),
            'telephone'   => $info?->corporative_whatsapp ?? '',
            'email'       => $info?->corporative_email ?? '',
            'address'     => [
                '@type'           => 'PostalAddress',
                'streetAddress'   => $info?->office_address ?? 'Cl. 12 #8 05',
                'addressLocality' => 'Soacha',
                'addressRegion'   => 'Cundinamarca',
                'postalCode'      => '250001',
                'addressCountry'  => 'CO',
            ],
            'geo' => [
                '@type'     => 'GeoCoordinates',
                'latitude'  => 4.5790,
                'longitude' => -74.2172,
            ],
            'areaServed' => [
                ['@type' => 'City',    'name' => 'Soacha'],
                ['@type' => 'State',   'name' => 'Cundinamarca'],
                ['@type' => 'Country', 'name' => 'Colombia'],
            ],
            'openingHoursSpecification' => [
                [
                    '@type'     => 'OpeningHoursSpecification',
                    'dayOfWeek' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    'opens'     => '09:00',
                    'closes'    => '17:00',
                ],
                [
                    '@type'     => 'OpeningHoursSpecification',
                    'dayOfWeek' => 'Saturday',
                    'opens'     => '10:00',
                    'closes'    => '13:00',
                ],
            ],
            'sameAs' => array_filter([
                $info?->corporative_facebook,
                $info?->corporative_instagram,
                $info?->corporative_linkedin,
                $info?->corporative_twitter,
            ]),
            'priceRange' => '$$',
        ]);

        return Inertia::render('Home', [
            'lawyers' => Lawyer::whereNotNull('user_id')
                ->with('user:id,name,email')
                ->orderBy('order')
                ->take(6)
                ->get(['id', 'name', 'slug', 'profession', 'image', 'user_id', 'order']),
            'homeBanner' => $homeBanner,
            'seo'        => $seo,
        ]);
    }
}
