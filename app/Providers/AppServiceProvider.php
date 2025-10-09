<?php

namespace App\Providers;

use App\Models\Citation;
use App\Observers\CitationObserver;
use BezhanSalleh\FilamentLanguageSwitch\LanguageSwitch;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
         // Dynamically set public path depending on environment
         $this->app->bind('path.public', function () {
            // Check if "public_html" exists one level above base_path
            $publicPath = base_path('../public_html');

            if (is_dir($publicPath)) {
                return $publicPath; // Use Hostinger public_html
            }

            return base_path('public'); // Default local dev
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        Citation::observe(CitationObserver::class);

        LanguageSwitch::configureUsing(function (LanguageSwitch $switch) {
            $switch
                ->locales(['es','en']); // also accepts a closure
        });
        // Configure storage URL for Hostinger
        if (app()->environment('production')) {
            config(['filesystems.disks.public.url' => env('APP_URL').'/storage']);
        }
    }
}
