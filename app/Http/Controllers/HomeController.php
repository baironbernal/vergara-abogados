<?php

namespace App\Http\Controllers;

use App\Models\Lawyer;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home', [
            'lawyers' => Lawyer::take(6)->get()
        ]);
    }
}