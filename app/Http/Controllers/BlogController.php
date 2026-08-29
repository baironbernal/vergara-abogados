<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Services\SeoManager;

class BlogController extends Controller
{
    public function index()
    {
        // Listing, search, filtering and pagination now live in App\Livewire\BlogList;
        // this action only resolves the page SEO metadata.
        $page = cache()->remember('page_seo_/blog', now()->addDay(), fn () => \App\Models\Page::where('route', '/blog')->first()
        );
        $seo = $page ? $page->seo : [
            'title' => 'Blog Legal — Consejos Inmobiliarios y Casos | Inmobiliaria Vergara Soacha',
            'description' => 'Artículos, casos y consejos legales sobre derecho inmobiliario en Soacha y Cundinamarca. Aprende sobre compra, venta, arriendo y trámites de propiedades.',
            'keywords' => 'blog inmobiliario Soacha, consejos legales Cundinamarca, derecho inmobiliario Colombia, artículos abogados',
        ];

        SeoManager::set($seo);

        return view('pages.blog.index', [
            'seo' => $seo,
        ]);
    }

    public function show(Blog $blog)
    {
        if ($blog->status !== 'published' || $blog->published_at > now()) {
            abort(404);
        }

        $blog->load('user:id,name');

        // Get related blogs
        $relatedBlogs = Blog::published()
            ->where('id', '!=', $blog->id)
            ->latest('published_at')
            ->take(3)
            ->get();

        $seo = $blog->seo ?: [
            'title' => $blog->meta_title ?: "{$blog->title} — Blog Inmobiliaria Vergara Soacha",
            'description' => $blog->meta_description ?: $blog->excerpt,
            'keywords' => $blog->meta_keywords ?: "blog inmobiliario, {$blog->title}, Soacha, derecho inmobiliario",
        ];

        $breadcrumbSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => [
                ['@type' => 'ListItem', 'position' => 1, 'name' => 'Inicio', 'item' => url('/')],
                ['@type' => 'ListItem', 'position' => 2, 'name' => 'Blog', 'item' => url('/blog')],
                ['@type' => 'ListItem', 'position' => 3, 'name' => $blog->title],
            ],
        ];

        $articleSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'Article',
            'headline' => $blog->title,
            'description' => $blog->excerpt ?? '',
            'url' => url("/blog/{$blog->slug}"),
            'datePublished' => $blog->published_at?->toIso8601String(),
            'dateModified' => $blog->updated_at->toIso8601String(),
            'image' => $blog->featured_image ? asset("storage/{$blog->featured_image}") : null,
            'author' => [
                '@type' => 'Person',
                'name' => $blog->user?->name ?? 'Inmobiliaria Vergara y Abogados',
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => 'Inmobiliaria Vergara y Abogados',
                'logo' => ['@type' => 'ImageObject', 'url' => asset('logo.png')],
            ],
            'mainEntityOfPage' => ['@type' => 'WebPage', '@id' => url("/blog/{$blog->slug}")],
        ];

        SeoManager::set($seo);
        SeoManager::setSchema($breadcrumbSchema);
        SeoManager::setSchema($articleSchema);

        // Both schemas registered above are rendered into <head> by <x-shared.json-ld>.
        return view('pages.blog.show', [
            'blog' => $blog,
            'relatedBlogs' => $relatedBlogs,
            'seo' => $seo,
        ]);
    }
}
