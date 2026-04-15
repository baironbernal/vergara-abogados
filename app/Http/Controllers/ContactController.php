<?php

namespace App\Http\Controllers;

use App\Models\Citation;
use App\Models\Lawyer;
use App\Models\Page;
use App\Services\SeoManager;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        // Get SEO from Page model
        $page = cache()->remember('page_seo_/contacto', now()->addDay(), fn () =>
            Page::where('route', '/contacto')->first()
        );
        $seo = $page ? $page->seo : [
            'title'       => 'Contacto — Agenda tu Cita Legal en Soacha | Inmobiliaria Vergara y Abogados',
            'description' => 'Agenda tu consulta legal con nuestros abogados inmobiliarios en Soacha, Cundinamarca. Asesoría personalizada. Respuesta garantizada en menos de 24 horas.',
            'keywords'    => 'contacto abogados Soacha, cita legal Soacha, asesoría inmobiliaria Cundinamarca, consulta abogados Soacha',
        ];

        // Only expose time-slot data needed by the calendar — no customer PII.
        $citations = Citation::with('lawyer:id,name')
            ->whereNotNull('starts_at')
            ->whereNotNull('ends_at')
            ->get()
            ->map(function ($citation) {
                return [
                    'lawyer_id'  => $citation->lawyer_id,
                    'lawyer'     => $citation->lawyer
                        ? ['id' => $citation->lawyer->id, 'name' => $citation->lawyer->name]
                        : null,
                    'starts_at'  => $citation->starts_at,
                    'ends_at'    => $citation->ends_at,
                    'is_blocked' => $citation->blocked_by_user,
                ];
            });

        SeoManager::set($seo);

        $lawyers = Lawyer::get(['id', 'name', 'slug']);

        // Note: corporativeInfo is already shared globally via HandleInertiaRequests middleware
        return Inertia::render('Contact', [
            'citations' => $citations,
            'lawyers' => $lawyers,
            'seo' => $seo,
        ]);
    }

    public function savePartial(Request $request)
    {
        $validatedData = $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|max:255',
            'phone'        => 'required|string|max:50',
            'lawyer_id'    => 'required|string',
            'observations' => 'nullable|string|max:2000',
        ]);

        // Handle "cualquiera" option
        $lawyerId = null;
        if ($validatedData['lawyer_id'] !== 'cualquiera') {
            $request->validate(['lawyer_id' => 'exists:lawyers,id']);
            $lawyerId = $validatedData['lawyer_id'];
        }

        $citation = Citation::create([
            'name'         => $validatedData['name'],
            'email'        => $validatedData['email'],
            'phone'        => $validatedData['phone'],
            'lawyer_id'    => $lawyerId,
            'observations' => $validatedData['observations'],
            'starts_at'    => null,
            'ends_at'      => null,
        ]);

        // Bind this citation to the current session so completeReservation
        // can verify ownership and prevent IDOR attacks.
        session(['pending_citation_id' => $citation->id]);

        return response()->json([
            'success'     => true,
            'citation_id' => $citation->id,
            'message'     => 'Información guardada exitosamente',
        ]);
    }

    public function completeReservation(Request $request)
    {
        $validatedData = $request->validate([
            'citation_id' => 'required|integer|exists:citations,id',
            'starts_at'   => 'required|date|after:now',
            'ends_at'     => 'required|date|after:starts_at',
        ]);

        // Prevent IDOR: verify the citation belongs to this browser session.
        $pendingId = session('pending_citation_id');
        if (!$pendingId || (int) $pendingId !== (int) $validatedData['citation_id']) {
            abort(403, 'No autorizado para modificar esta cita.');
        }

        $citation = Citation::findOrFail($validatedData['citation_id']);
        $citation->update([
            'starts_at' => $validatedData['starts_at'],
            'ends_at'   => $validatedData['ends_at'],
        ]);

        // One-time use — clear the session binding.
        session()->forget('pending_citation_id');

        return response()->json([
            'success' => true,
            'message' => 'Reserva completada exitosamente',
        ]);
    }
}
