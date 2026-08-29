<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Services\SeoManager;

class ContactController extends Controller
{
    public function index()
    {
        // Get SEO from Page model
        $page = cache()->remember('page_seo_/contacto', now()->addDay(), fn () => Page::where('route', '/contacto')->first()
        );
        $seo = $page ? $page->seo : [
            'title' => 'Contacto — Agenda tu Cita Legal en Soacha | Inmobiliaria Vergara y Abogados',
            'description' => 'Agenda tu consulta legal con nuestros abogados inmobiliarios en Soacha, Cundinamarca. Asesoría personalizada. Respuesta garantizada en menos de 24 horas.',
            'keywords' => 'contacto abogados Soacha, cita legal Soacha, asesoría inmobiliaria Cundinamarca, consulta abogados Soacha',
        ];

        SeoManager::set($seo);

        // Lawyers and booked slots are queried by App\Livewire\ContactForm, which
        // only ever loads the week being displayed instead of every citation.
        return view('pages.contact', [
            'seo' => $seo,
        ]);
    }
}
