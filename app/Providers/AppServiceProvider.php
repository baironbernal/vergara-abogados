<?php

namespace App\Providers;

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
        //
    }
}
