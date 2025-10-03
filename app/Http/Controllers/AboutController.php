<?php

namespace App\Http\Controllers;

use App\Models\Lawyer;
use App\Models\Page;
use Inertia\Inertia;

class AboutController extends Controller
{
    public function index()
    {
        // Get SEO from Page model
        $page = Page::where('route', '/acerca')->first();
        $seo = $page ? $page->seo : [
            'title' => 'Acerca de Nosotros - Inmobiliaria Vergara',
            'description' => 'Conoce a nuestro equipo de abogados especializados en derecho inmobiliario. Experiencia, profesionalismo y compromiso en cada caso.',
            'keywords' => 'acerca de, equipo legal, abogados inmobiliarios, profesionales, inmobiliaria vergara',
        ];

        $lawyers = Lawyer::whereNotNull('user_id')
            ->with('user')
            ->get(['id', 'name', 'description', 'image', 'user_id']);

        return Inertia::render('About', [
            'seo' => $seo,
            'lawyers' => $lawyers,
        ]);
    }
}
