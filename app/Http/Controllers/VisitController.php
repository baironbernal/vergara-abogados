<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use Illuminate\Http\Request;

class VisitController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|max:255',
            'phone'        => 'required|string|max:50',
            'property_id'  => 'required|exists:properties,id',
            'visit_date'   => 'required|date|after_or_equal:today',
            'visit_time'   => 'required|date_format:H:i',
            'observations' => 'nullable|string|max:1000',
        ]);

        // Validate that the combined date+time is in the future
        $visitDateTime = $validatedData['visit_date'] . ' ' . $validatedData['visit_time'];
        if (strtotime($visitDateTime) <= time()) {
            return response()->json([
                'success' => false,
                'message' => 'La fecha y hora de la visita deben ser futuras',
                'errors'  => ['visit_date' => ['La fecha y hora deben ser futuras']],
            ], 422);
        }

        try {
            $visit = Visit::create($validatedData);
        } catch (\Exception $e) {
            \Log::error('Error creating visit', ['exception' => $e]);

            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor. Por favor intente nuevamente.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Visita agendada exitosamente',
            'visit'   => $visit,
        ], 201);
    }
}
