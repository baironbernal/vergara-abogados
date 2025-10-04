<?php

namespace App\Http\Controllers;

use App\Models\Lawyer;
use Inertia\Inertia;

class LawyerController extends Controller
{
    public function show(Lawyer $lawyer)
    {
        $seo = [
            'title' => $lawyer->name . ' - Abogado - Inmobiliaria Vergara',
            'description' => $lawyer->description ?: 'Perfil profesional de ' . $lawyer->name . ', ' . $lawyer->profession . ' en Soacha, Cundinamarca.',
            'keywords' => 'abogado soacha, ' . strtolower($lawyer->profession) . ', ' . strtolower($lawyer->name) . ', servicios legales soacha, asesoría legal cundinamarca',
        ];

        return Inertia::render('LawyerDetail', [
            'lawyer' => $lawyer,
            'seo' => $seo,
        ]);
    }
}
