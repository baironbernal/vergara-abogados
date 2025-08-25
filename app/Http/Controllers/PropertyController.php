<?php

namespace App\Http\Controllers;

use App\Models\Municipality;
use App\Models\Property;
use App\Models\State;
use Inertia\Inertia;

class PropertyController extends Controller
{
    public function index()
    {
        return Inertia::render('Properties', [
            'states' => State::all(),
            'municipalities' => Municipality::all(),
            'properties' => Property::with(['municipality'])->get()
        ]);
    }

    public function show(Property $property)
    {
        return Inertia::render('PropertyDetail', [
            'property' => $property->load(['municipality.state'])
        ]);
    }
}
