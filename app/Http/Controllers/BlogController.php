<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Services\SeoManager;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        // Limit search string to avoid full-table-scan DoS on the content column.
        $search = $request->string('search')->limit(100)->value() ?: null;
        $featured = $request->get('featured');

        $blogsQuery = Blog::published()
            ->with('user:id,name')
            ->latest('published_at');

        if ($search) {
            $blogsQuery->where(function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($featured === 'true') {
            $blogsQuery->featured();
        }

        $blogs = $blogsQuery->paginate(9);

        $page = cache()->remember('page_seo_/blog', now()->addDay(), fn () => \App\Models\Page::where('route', '/blog')->first()
        );
        $seo = $page ? $page->seo : [
            'title' => 'Blog Legal — Consejos Inmobiliarios y Casos | Inmobiliaria Vergara Soacha',
            'description' => 'Artículos, casos y consejos legales sobre derecho inmobiliario en Soacha y Cundinamarca. Aprende sobre compra, venta, arriendo y trámites de propiedades.',
            'keywords' => 'blog inmobiliario Soacha, consejos legales Cundinamarca, derecho inmobiliario Colombia, artículos abogados',
        ];

        SeoManager::set($seo);

        return Inertia::render('Blog/Index', [
            'blogs' => $blogs,
            'filters' => [
                'search' => $search,
                'featured' => $featured,
            ],
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

        return Inertia::render('Blog/Show', [
            'blog' => $blog,
            'relatedBlogs' => $relatedBlogs,
            'seo' => $seo,
            'schema' => SeoManager::schema(),
        ]);
    }
}
