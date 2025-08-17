<?php

use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Home');
});

Route::get('/about', function () {
    return inertia('About');
});


Route::get('/contact', [ContactController::class, 'index']);


