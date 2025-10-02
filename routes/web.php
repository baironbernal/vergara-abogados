<?php

use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\VisitController;
use App\Services\SEOService;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index']);

Route::get('/acerca', function () {
    $seoData = SEOService::generateMetaTags([
        'title' => 'Acerca de Nosotros - Inmobiliaria Vergara',
        'description' => 'Conoce la historia, misión y valores de Inmobiliaria Vergara. Expertos en bienes raíces y derecho inmobiliario con años de experiencia sirviendo a nuestros clientes.',
        'keywords' => 'acerca de, inmobiliaria vergara, historia, misión, valores, experiencia, bienes raíces',
        'type' => 'website',
    ]);

    $lawyers = \App\Models\Lawyer::whereNotNull('user_id')
        ->with('user')
        ->get(['id', 'name', 'description', 'image', 'user_id']);

    return inertia('About', [
        'seo' => $seoData,
        'lawyers' => $lawyers,
    ]);
});

Route::get('/contacto', [ContactController::class, 'index']);
Route::post('/contacto/save-partial', [ContactController::class, 'savePartial'])->name('contact.save-partial');
Route::post('/contacto/complete-reservation', [ContactController::class, 'completeReservation'])->name('contact.complete-reservation');
Route::get('/servicios', [ServiceController::class, 'index']);
Route::get('/servicios/{service}', [ServiceController::class, 'show'])->name('service.show');
Route::get('/inmobiliaria', [PropertyController::class, 'index']);
Route::get('/inmobiliaria/{property}', [PropertyController::class, 'show'])->name('property.show');
// Visit Routes
Route::post('/inmobiliaria/visits', [VisitController::class, 'store'])->name('visits.store');
// Blog Routes
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{blog}', [BlogController::class, 'show'])->name('blog.show');



// SEO Routes
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');



