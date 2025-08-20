<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Home');
});

Route::get('/acerca', function () {
    return inertia('About');
});

Route::get('/contacto', [ContactController::class, 'index']);
Route::get('/servicios', [ServiceController::class, 'index']);
Route::get('/inmobiliaria', [ServiceController::class, 'index']);



