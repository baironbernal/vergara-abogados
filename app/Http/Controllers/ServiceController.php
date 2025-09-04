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

    public function show(Service $service)
    {
        $seoData = SEOService::generateMetaTags([
            'title' => $service->name . ' - Servicios Legales Inmobiliarios - Inmobiliaria Vergara',
            'description' => $service->description ?: 'Servicio legal especializado en ' . $service->category . '. Asesoría profesional y experta en derecho inmobiliario.',
            'keywords' => strtolower($service->name) . ', ' . strtolower($service->category) . ', servicios legales, derecho inmobiliario, asesoría jurídica',
            'type' => 'website',
        ]);

        // Get lawyers who might be related to this service category
        $relatedLawyers = Lawyer::all();

        return Inertia::render('ServiceDetail', [
            'service' => $service,
            'lawyers' => $relatedLawyers,
            'seo' => $seoData,
        ]);
    }
}
