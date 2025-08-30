<?php

namespace App\Http\Controllers;

use App\Models\Municipality;
use App\Models\Property;
use App\Models\State;
use App\Services\SEOService;
use Inertia\Inertia;

class PropertyController extends Controller
{
    public function index()
    {
        $seoData = SEOService::generateMetaTags([
            'title' => 'Propiedades en Venta y Alquiler - Inmobiliaria Vergara',
            'description' => 'Explora nuestra amplia selección de propiedades en venta y alquiler en Colombia. Casas, apartamentos, locales comerciales y más con asesoría legal especializada.',
            'keywords' => 'propiedades en venta, propiedades en alquiler, casas, apartamentos, locales comerciales, bienes raíces Colombia',
            'type' => 'website',
        ]);

        return Inertia::render('Properties', [
            'states' => State::all(),
            'municipalities' => Municipality::all(),
            'properties' => Property::with(['municipality'])->get(),
            'seo' => $seoData,
        ]);
    }

    public function show(Property $property)
    {
        $property->load(['municipality.state']);
        $seoData = SEOService::generatePropertySEO($property);

        return Inertia::render('PropertyDetail', [
            'property' => $property,
            'seo' => $seoData,
        ]);
    }
}
