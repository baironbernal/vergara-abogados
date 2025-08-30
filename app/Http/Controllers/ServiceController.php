<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Lawyer;
use App\Services\SEOService;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $seoData = SEOService::generateMetaTags([
            'title' => 'Servicios Legales Inmobiliarios - Inmobiliaria Vergara',
            'description' => 'Servicios legales especializados en derecho inmobiliario. Asesoría jurídica, trámites de propiedades, contratos y más servicios legales profesionales.',
            'keywords' => 'servicios legales, derecho inmobiliario, asesoría jurídica, trámites propiedades, contratos inmobiliarios, abogados',
            'type' => 'website',
        ]);

        return Inertia::render('Services', [
            'services' => Service::all(),
            'lawyers' => Lawyer::all(),
            'seo' => $seoData,
        ]);
    }
}
