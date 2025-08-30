<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class VisitController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:50',
                'property_id' => 'required|exists:properties,id',
                'visit_date' => 'required|date|after_or_equal:today',
                'visit_time' => 'required|date_format:H:i',
                'observations' => 'nullable|string|max:1000',
            ]);

            // Validate that the visit date and time are in the future
            $visitDateTime = $validatedData['visit_date'] . ' ' . $validatedData['visit_time'];
            if (strtotime($visitDateTime) <= time()) {
                return response()->json([
                    'success' => false,
                    'message' => 'La fecha y hora de la visita deben ser futuras',
                    'errors' => [
                        'visit_date' => ['La fecha y hora deben ser futuras']
                    ]
                ], 422);
            }

            $visit = Visit::create($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Visita agendada exitosamente',
                'visit' => $visit
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }
}
