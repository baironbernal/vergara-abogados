<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Inertia\Inertia;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $featured = $request->get('featured');

        $blogsQuery = Blog::published()
            ->with('user')
            ->latest('published_at');

        if ($search) {
            $blogsQuery->where(function($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('excerpt', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($featured === 'true') {
            $blogsQuery->featured();
        }

        $blogs = $blogsQuery->paginate(9);

        // Get SEO from Page model
        $page = \App\Models\Page::where('route', '/blog')->first();
        $seo = $page ? $page->seo : [
            'title' => 'Blogs y casos',
            'description' => 'Blogs y casos ',
            'keywords' => 'inmobiliaria, asesoría jurídica, derecho inmobiliario, abogados, propiedades, bienes raíces, Soacha, Soacha Cundinamarca',
        ];

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

        $blog->load('user');

        // Get related blogs
        $relatedBlogs = Blog::published()
            ->where('id', '!=', $blog->id)
            ->latest('published_at')
            ->take(3)
            ->get();

        // Get SEO from Blog model or fallback to meta tags or default
        $seo = $blog->seo ?: [
            'title' => $blog->meta_title ?: "{$blog->title} - Blog Inmobiliaria Vergara",
            'description' => $blog->meta_description ?: $blog->excerpt,
            'keywords' => $blog->meta_keywords ?: "blog, inmobiliaria, bienes raíces, {$blog->title}",
        ];

        return Inertia::render('Blog/Show', [
            'blog' => $blog,
            'relatedBlogs' => $relatedBlogs,
            'seo' => $seo
        ]);
    }

}
