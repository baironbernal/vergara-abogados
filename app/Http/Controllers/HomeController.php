<?php

namespace App\Http\Controllers;

use App\Models\HomeBanner;
use App\Models\Lawyer;
use App\Models\Page;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Get the latest home banner
        $homeBanner = HomeBanner::latest()->first();

        // Get SEO from Page model
        $page = Page::where('route', '/')->first();
        $seo = $page ? $page->seo : [
            'title' => 'Inmobiliaria Vergara - Expertos en Asesoría Jurídica Inmobiliaria',
            'description' => 'Inmobiliaria Vergara ofrece servicios legales especializados en derecho inmobiliario. Compra, venta y asesoría legal de propiedades con profesionales expertos.',
            'keywords' => 'inmobiliaria, asesoría jurídica, derecho inmobiliario, abogados, propiedades, bienes raíces',
        ];

        return Inertia::render('Home', [
            'lawyers' => Lawyer::whereNotNull('user_id')
                ->with('user')
                ->take(6)
                ->get(),
            'homeBanner' => $homeBanner,
            'seo' => $seo
        ]);
    }
}
