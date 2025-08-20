<?php

namespace App\Http\Controllers;

use App\Models\Citation;
use App\Models\Lawyer;
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
}
