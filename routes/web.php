<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LawyerController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\RssController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/acerca', [AboutController::class, 'index'])->name('about');
Route::get('/abogados/{lawyer:slug}', [LawyerController::class, 'show'])->name('lawyers.show');

Route::get('/contacto', [ContactController::class, 'index'])->name('contact');
Route::get('/servicios', [ServiceController::class, 'index'])->name('services.index');
Route::get('/servicios/{service}', [ServiceController::class, 'show'])->name('service.show');
Route::get('/inmobiliaria', [PropertyController::class, 'index'])->name('properties.index');
Route::get('/inmobiliaria/{property}', [PropertyController::class, 'show'])->name('property.show');

// The public POST endpoints (contact.save-partial, contact.complete-reservation,
// visits.store) were removed with React: their work is now done by the Livewire
// components App\Livewire\ContactForm and App\Livewire\VisitForm, which enforce
// the same 10-requests-per-minute budget internally.

// Blog Routes
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{blog}', [BlogController::class, 'show'])->name('blog.show');

// SEO Routes
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/rss', [RssController::class, 'index'])->name('rss');
