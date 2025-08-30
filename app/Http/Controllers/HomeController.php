<?php

namespace App\Http\Controllers;

use App\Models\Lawyer;
use App\Services\SEOService;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $seoData = SEOService::generateMetaTags([
            'title' => 'Inmobiliaria Vergara - Expertos en Bienes Raíces y Derecho Inmobiliario',
            'description' => 'Descubre nuestros servicios integrales de bienes raíces y asesoría legal especializada. Propiedades exclusivas, abogados expertos y soluciones inmobiliarias en Colombia.',
            'keywords' => 'inmobiliaria, bienes raíces, propiedades, venta, alquiler, derecho inmobiliario, asesoría legal, abogados, Colombia',
            'type' => 'website',
            'structured_data' => SEOService::getOrganizationStructuredData(),
        ]);

        return Inertia::render('Home', [
            'lawyers' => Lawyer::take(6)->get(),
            'seo' => $seoData,
        ]);
    }
}