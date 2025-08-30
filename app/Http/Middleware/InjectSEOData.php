<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\SEOService;
use App\Models\Blog;

class InjectSEOData
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Share global data with all Inertia responses
        if ($request->route() && !$request->is('admin/*')) {
            // Get latest blogs for footer
            $latestBlogs = Blog::published()
                ->latest('published_at')
                ->take(4)
                ->get(['id', 'title', 'slug', 'published_at']);

            Inertia::share('latestBlogs', $latestBlogs);

            // Share default SEO data if not already set
            Inertia::share('seo', function () {
                $seoData = SEOService::generateMetaTags();
                return $seoData;
            });
        }

        return $response;
    }
}