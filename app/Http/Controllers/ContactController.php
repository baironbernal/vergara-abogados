<?php

namespace App\Http\Controllers;

use App\Models\Citation;
use App\Models\Lawyer;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        // Get SEO from Page model
        $page = Page::where('route', '/contacto')->first();
        $seo = $page ? $page->seo : [
            'title' => 'Contacto - Agenda tu Cita Legal - Inmobiliaria Vergara',
            'description' => 'Agenda tu cita con nuestros expertos en derecho inmobiliario. Consulta legal profesional, asesoría personalizada y soluciones a tus necesidades inmobiliarias.',
            'keywords' => 'contacto, cita legal, asesoría inmobiliaria, consulta abogados, agenda cita, derecho inmobiliario',
        ];

        // Get all citations (both customer bookings and blocked slots)
        $citations = Citation::with('lawyer')
            ->whereNotNull('starts_at')
            ->whereNotNull('ends_at')
            ->get()
            ->map(function ($citation) {
                return [
                    'id' => $citation->id,
                    'lawyer_id' => $citation->lawyer_id,
                    'lawyer' => $citation->lawyer,
                    'starts_at' => $citation->starts_at,
                    'ends_at' => $citation->ends_at,
                    'is_blocked' => $citation->blocked_by_user,
                ];
            });

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
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'lawyer_id' => 'required|string',
            'observations' => 'nullable|string',
        ]);

        // Handle "cualquiera" option
        $lawyerId = null;
        if ($validatedData['lawyer_id'] !== 'cualquiera') {
            // Validate that the lawyer exists if not "cualquiera"
            $request->validate([
                'lawyer_id' => 'exists:lawyers,id',
            ]);
            $lawyerId = $validatedData['lawyer_id'];
        }

        // Create partial citation record
        $citation = Citation::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'phone' => $validatedData['phone'],
            'lawyer_id' => $lawyerId,
            'observations' => $validatedData['observations'],
            'starts_at' => null, // Will be filled when calendar slot is selected
            'ends_at' => null,   // Will be filled when calendar slot is selected
        ]);

        // Load the lawyer relationship for the response
        $citation->load('lawyer');
        
        return response()->json([
            'success' => true,
            'citation_id' => $citation->id,
            'citation' => $citation,
            'message' => 'Información guardada exitosamente'
        ]);
    }

    public function completeReservation(Request $request)
    {
        $validatedData = $request->validate([
            'citation_id' => 'required|exists:citations,id',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after:starts_at',
        ]);

        $citation = Citation::findOrFail($validatedData['citation_id']);
        $citation->update([
            'starts_at' => $validatedData['starts_at'],
            'ends_at' => $validatedData['ends_at'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reserva completada exitosamente'
        ]);
    }
}
