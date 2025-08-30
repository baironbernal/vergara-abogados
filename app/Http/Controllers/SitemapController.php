<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Property;
use App\Models\Service;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index()
    {
        $properties = Property::latest()->get();
        $services = Service::all();
        $blogs = Blog::published()->latest('published_at')->get();
        
        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        
        // Home page
        $xml .= '<url>';
        $xml .= '<loc>' . url('/') . '</loc>';
        $xml .= '<changefreq>weekly</changefreq>';
        $xml .= '<priority>1.0</priority>';
        $xml .= '<lastmod>' . now()->format('Y-m-d\TH:i:sP') . '</lastmod>';
        $xml .= '</url>';
        
        // About page
        $xml .= '<url>';
        $xml .= '<loc>' . url('/acerca') . '</loc>';
        $xml .= '<changefreq>monthly</changefreq>';
        $xml .= '<priority>0.8</priority>';
        $xml .= '</url>';
        
        // Contact page
        $xml .= '<url>';
        $xml .= '<loc>' . url('/contacto') . '</loc>';
        $xml .= '<changefreq>monthly</changefreq>';
        $xml .= '<priority>0.8</priority>';
        $xml .= '</url>';
        
        // Services page
        $xml .= '<url>';
        $xml .= '<loc>' . url('/servicios') . '</loc>';
        $xml .= '<changefreq>weekly</changefreq>';
        $xml .= '<priority>0.9</priority>';
        $xml .= '</url>';
        
        // Properties page
        $xml .= '<url>';
        $xml .= '<loc>' . url('/inmobiliaria') . '</loc>';
        $xml .= '<changefreq>daily</changefreq>';
        $xml .= '<priority>0.9</priority>';
        $xml .= '</url>';
        
        // Blog page
        $xml .= '<url>';
        $xml .= '<loc>' . url('/blog') . '</loc>';
        $xml .= '<changefreq>daily</changefreq>';
        $xml .= '<priority>0.8</priority>';
        $xml .= '</url>';
        
        // Individual properties
        foreach ($properties as $property) {
            $xml .= '<url>';
            $xml .= '<loc>' . url("/inmobiliaria/{$property->id}") . '</loc>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>0.7</priority>';
            $xml .= '<lastmod>' . $property->updated_at->format('Y-m-d\TH:i:sP') . '</lastmod>';
            $xml .= '</url>';
        }
        
        // Individual blog posts
        foreach ($blogs as $blog) {
            $xml .= '<url>';
            $xml .= '<loc>' . url("/blog/{$blog->slug}") . '</loc>';
            $xml .= '<changefreq>monthly</changefreq>';
            $xml .= '<priority>0.6</priority>';
            $xml .= '<lastmod>' . $blog->updated_at->format('Y-m-d\TH:i:sP') . '</lastmod>';
            $xml .= '</url>';
        }
        
        $xml .= '</urlset>';
        
        return response($xml)
            ->header('Content-Type', 'application/xml');
    }
}