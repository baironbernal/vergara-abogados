<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LawyerController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\VisitController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index']);
Route::get('/acerca', [AboutController::class, 'index']);
Route::get('/abogados/{lawyer:slug}', [LawyerController::class, 'show'])->name('lawyers.show');

Route::get('/contacto', [ContactController::class, 'index']);
Route::get('/servicios', [ServiceController::class, 'index']);
Route::get('/servicios/{service}', [ServiceController::class, 'show'])->name('service.show');
Route::get('/inmobiliaria', [PropertyController::class, 'index']);
Route::get('/inmobiliaria/{property}', [PropertyController::class, 'show'])->name('property.show');

// Public submission endpoints — rate-limited to prevent spam and flooding.
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/contacto/save-partial', [ContactController::class, 'savePartial'])->name('contact.save-partial');
    Route::post('/contacto/complete-reservation', [ContactController::class, 'completeReservation'])->name('contact.complete-reservation');
    // Visit Routes
    Route::post('/inmobiliaria/visits', [VisitController::class, 'store'])->name('visits.store');
});
// Blog Routes
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{blog}', [BlogController::class, 'show'])->name('blog.show');

// SEO Routes
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/rss', [RssController::class, 'index'])->name('rss');
