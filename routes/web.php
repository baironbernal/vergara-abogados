<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index']);

Route::get('/acerca', function () {
    return inertia('About');
});

Route::get('/contacto', [ContactController::class, 'index']);
Route::post('/contacto/save-partial', [ContactController::class, 'savePartial'])->name('contact.save-partial');
Route::post('/contacto/complete-reservation', [ContactController::class, 'completeReservation'])->name('contact.complete-reservation');
Route::get('/servicios', [ServiceController::class, 'index']);
Route::get('/inmobiliaria', [PropertyController::class, 'index']);
Route::get('/inmobiliaria/{property}', [PropertyController::class, 'show'])->name('property.show');



