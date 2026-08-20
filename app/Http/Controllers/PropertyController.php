<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Property;
use App\Services\SeoManager;

class PropertyController extends Controller
{
    public function index()
    {
        $page = cache()->remember('page_seo_/inmobiliaria', now()->addDay(), fn () => Page::where('route', '/inmobiliaria')->first()
        );
        $seo = $page ? $page->seo : [
            'title' => 'Propiedades en Venta y Arriendo en Soacha y Cundinamarca — Inmobiliaria Vergara',
            'description' => 'Encuentra casas, apartamentos, lotes y más en Soacha, Cundinamarca con respaldo jurídico. Compra y vende propiedades de forma segura con asesoría legal incluida.',
            'keywords' => 'propiedades Soacha, casas en venta Soacha, apartamentos Soacha, inmobiliaria Cundinamarca, bienes raíces Soacha, arriendo Soacha',
        ];

        SeoManager::set($seo);

        // Listing, filtering and pagination now live in App\Livewire\PropertyCatalog;
        // this action only resolves the page SEO metadata.
        return view('pages.properties.index', [
            'seo' => $seo,
        ]);
    }

    public function show(Property $property)
    {
        $property->load(['municipality.state']);
        $property->append('type_spanish');

        $municipality = $property->municipality->name ?? 'Soacha';
        $seo = $property->seo ?: [
            'title' => $property->name.' en '.$municipality.', Cundinamarca — Inmobiliaria Vergara',
            'description' => $property->description
                ?: $property->type_spanish.' en venta en '.$municipality.', Cundinamarca. '
                   .'Compra segura con respaldo jurídico especializado.',
            'keywords' => strtolower($property->type).', '.strtolower($property->name)
                           .', propiedades '.strtolower($municipality).', bienes raíces Cundinamarca',
        ];

        $breadcrumbSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => [
                ['@type' => 'ListItem', 'position' => 1, 'name' => 'Inicio', 'item' => url('/')],
                ['@type' => 'ListItem', 'position' => 2, 'name' => 'Propiedades', 'item' => url('/inmobiliaria')],
                ['@type' => 'ListItem', 'position' => 3, 'name' => $property->name],
            ],
        ];

        SeoManager::set($seo);
        SeoManager::setSchema($breadcrumbSchema);

        // The breadcrumb schema is rendered into <head> by <x-shared.json-ld>.
        return view('pages.properties.show', [
            'property' => $property,
            'seo' => $seo,
        ]);
    }
}
