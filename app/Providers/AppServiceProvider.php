<?php

namespace App\Providers;

use App\Models\Blog;
use App\Models\Citation;
use App\Models\Information;
use App\Observers\CitationObserver;
use BezhanSalleh\FilamentLanguageSwitch\LanguageSwitch;
use Illuminate\Support\Facades\View;
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

        // Citation::observe(CitationObserver::class);

        // Share corporate info + latest blog posts with the Blade public layouts
        // and pages, replacing the Inertia shared props (corporativeInfo / canonicalUrl).
        // Pages are included because the layout is a component: data composed onto
        // the layout view is not visible inside the slot the page renders.
        View::composer(['components.layouts.*', 'pages.*'], function ($view) {
            $view->with([
                'corporativeInfo' => cache()->remember('corporative_info', now()->addHours(6), fn () => Information::latest()->first()
                ),
                'latestBlogs' => cache()->remember('layout_latest_blogs', now()->addHour(), fn () => Blog::published()->latestPublished()->take(3)->get(['id', 'title', 'slug', 'published_at'])
                ),
            ]);
        });

        LanguageSwitch::configureUsing(function (LanguageSwitch $switch) {
            $switch
                ->locales(['es', 'en']); // also accepts a closure
        });
        // Configure storage URL for Hostinger
        if (app()->environment('production')) {
            config(['filesystems.disks.public.url' => env('APP_URL').'/storage']);
        }
    }
}
