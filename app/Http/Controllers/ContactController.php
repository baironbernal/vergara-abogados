<?php

namespace App\Http\Controllers;

use App\Models\Citation;
use App\Models\Lawyer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        
        $citations = Citation::with('lawyer')->get(['id', 'lawyer_id', 'starts_at', 'ends_at']);
        $lawyers = Lawyer::all(['id', 'name']);
        
        return Inertia::render('Contact', [
            'citations' => $citations,
            'lawyers' => $lawyers,
        ]);
    }

    public function savePartial(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'lawyer_id' => 'required|exists:lawyers,id',
            'observations' => 'nullable|string',
        ]);

        // Create partial citation record
        $citation = Citation::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'phone' => $validatedData['phone'],
            'lawyer_id' => $validatedData['lawyer_id'],
            'observations' => $validatedData['observations'],
            'starts_at' => null, // Will be filled when calendar slot is selected
            'ends_at' => null,   // Will be filled when calendar slot is selected
        ]);

        return response()->json([
            'success' => true,
            'citation_id' => $citation->id,
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
