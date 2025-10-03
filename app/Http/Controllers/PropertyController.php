<?php

namespace App\Http\Controllers;

use App\Models\Municipality;
use App\Models\Property;
use App\Models\State;
use App\Models\Page;
use Inertia\Inertia;

class PropertyController extends Controller
{
    public function index()
    {
        // Get SEO from Page model
        $page = Page::where('route', '/inmobiliaria')->first();
        $seo = $page ? $page->seo : [
            'title' => 'Propiedades en Venta y Alquiler - Inmobiliaria Vergara',
            'description' => 'Explora nuestra amplia selección de propiedades en venta y alquiler en Colombia. Casas, apartamentos, locales comerciales y más con asesoría legal especializada.',
            'keywords' => 'propiedades en venta, propiedades en alquiler, casas, apartamentos, locales comerciales, bienes raíces Colombia',
        ];

        return Inertia::render('Properties', [
            'states' => State::all(),
            'municipalities' => Municipality::all(),
            'properties' => Property::with(['municipality'])->get(),
            'seo' => $seo,
        ]);
    }

    public function show(Property $property)
    {
        $property->load(['municipality.state']);

        // Get SEO from Property model or fallback to default
        $seo = $property->seo ?: [
            'title' => $property->name . ' - Propiedades - Inmobiliaria Vergara',
            'description' => $property->description ?: 'Propiedad en ' . ($property->municipality->name ?? 'Colombia') . '. Encuentra tu hogar ideal con asesoría legal especializada.',
            'keywords' => strtolower($property->type) . ', ' . strtolower($property->name) . ', propiedades, bienes raíces, ' . strtolower($property->municipality->name ?? 'Colombia'),
        ];

        return Inertia::render('PropertyDetail', [
            'property' => $property,
            'seo' => $seo,
        ]);
    }
}
