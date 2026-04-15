<?php

namespace App\Http\Controllers;

use App\Models\Lawyer;
use App\Models\Page;
use App\Services\SeoManager;
use Inertia\Inertia;

class AboutController extends Controller
{
    public function index()
    {
        $page = cache()->remember('page_seo_/acerca', now()->addDay(), fn () =>
            Page::where('route', '/acerca')->first()
        );
        $seo = $page ? $page->seo : [
            'title'       => 'Nuestro Equipo de Abogados en Soacha — Inmobiliaria Vergara y Abogados',
            'description' => 'Conoce a nuestros abogados especializados en derecho inmobiliario ubicados en Soacha, Cundinamarca. Experiencia, profesionalismo y compromiso en cada caso.',
            'keywords'    => 'abogados Soacha, equipo legal, abogados inmobiliarios Cundinamarca, firma de abogados Soacha',
        ];

        SeoManager::set($seo);

        $lawyers = Lawyer::whereNotNull('user_id')
            ->with('user')
            ->get(['id', 'name', 'description', 'image', 'user_id']);

        return Inertia::render('About', [
            'seo' => $seo,
            'lawyers' => $lawyers,
        ]);
    }
}
