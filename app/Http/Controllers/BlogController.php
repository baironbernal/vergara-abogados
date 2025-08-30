<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Services\SEOService;
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

        $seoData = SEOService::generateMetaTags([
            'title' => 'Blog - Artículos y Noticias Inmobiliarias - Inmobiliaria Vergara',
            'description' => 'Mantente informado con nuestros artículos sobre bienes raíces, derecho inmobiliario y tendencias del mercado. Consejos expertos y análisis del sector inmobiliario en Colombia.',
            'keywords' => 'blog inmobiliario, noticias bienes raíces, derecho inmobiliario, mercado inmobiliario Colombia, consejos propiedades, artículos inmobiliaria',
            'type' => 'website',
        ]);

        return Inertia::render('Blog/Index', [
            'blogs' => $blogs,
            'filters' => [
                'search' => $search,
                'featured' => $featured,
            ],
            'seo' => $seoData,
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

        $seoData = $this->generateBlogSEO($blog);

        return Inertia::render('Blog/Show', [
            'blog' => $blog,
            'relatedBlogs' => $relatedBlogs,
            'seo' => $seoData,
        ]);
    }

    private function generateBlogSEO($blog): array
    {
        $title = $blog->meta_title ?: "{$blog->title} - Blog Inmobiliaria Vergara";
        $description = $blog->meta_description ?: $blog->excerpt;
        $keywords = $blog->meta_keywords ?: "blog, inmobiliaria, bienes raíces, {$blog->title}";

        $structuredData = [
            "@context" => "https://schema.org",
            "@type" => "BlogPosting",
            "headline" => $blog->title,
            "description" => $description,
            "image" => url($blog->featured_image_url),
            "url" => url("/blog/{$blog->slug}"),
            "datePublished" => $blog->published_at->toISOString(),
            "dateModified" => $blog->updated_at->toISOString(),
            "author" => [
                "@type" => "Person",
                "name" => $blog->user->name
            ],
            "publisher" => [
                "@type" => "Organization",
                "name" => "Inmobiliaria Vergara",
                "logo" => [
                    "@type" => "ImageObject",
                    "url" => url('/logo.webp')
                ]
            ],
            "mainEntityOfPage" => [
                "@type" => "WebPage",
                "@id" => url("/blog/{$blog->slug}")
            ],
            "wordCount" => str_word_count(strip_tags($blog->content)),
            "timeRequired" => "PT{$blog->reading_time}M"
        ];

        return SEOService::generateMetaTags([
            'title' => $title,
            'description' => $description,
            'keywords' => $keywords,
            'image' => $blog->featured_image_url,
            'type' => 'article',
            'structured_data' => $structuredData,
        ]);
    }
}
