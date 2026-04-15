<?php

namespace App\Http\Controllers;

use App\Models\Blog;

class RssController extends Controller
{
    public function index()
    {
        $blogs = cache()->remember('rss_feed', now()->addHour(), fn () => Blog::published()
            ->with('user:id,name')
            ->latest('published_at')
            ->limit(50)
            ->get(['id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 'published_at', 'updated_at', 'user_id'])
        );

        $xml = $this->buildRss($blogs);

        return response($xml, 200, [
            'Content-Type' => 'application/rss+xml; charset=utf-8',
        ]);
    }

    private function buildRss($blogs): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">';
        $xml .= '<channel>';
        $xml .= '<title>Inmobiliaria Vergara y Abogados - Blog</title>';
        $xml .= '<link>'.url('/').'</link>';
        $xml .= '<description>Artículos, casos y consejos legales sobre derecho inmobiliario en Soacha y Cundinamarca.</description>';
        $xml .= '<language>es-co</language>';
        $xml .= '<lastBuildDate>'.now()->toRfc7231String().'</lastBuildDate>';
        $xml .= '<atom:link href="'.url('/rss').'" rel="self" type="application/rss+xml"/>';

        foreach ($blogs as $blog) {
            $xml .= '<item>';
            $xml .= '<title><![CDATA['.$blog->title.']]></title>';
            $xml .= '<link>'.url("/blog/{$blog->slug}").'</link>';
            $xml .= '<guid>'.url("/blog/{$blog->slug}").'</guid>';
            $xml .= '<description><![CDATA['.($blog->excerpt ?? strip_tags($blog->content ?? '')).']]></description>';
            $xml .= '<pubDate>'.$blog->published_at?->toRfc7231String().'</pubDate>';
            if ($blog->featured_image) {
                $xml .= '<enclosure url="'.asset("storage/{$blog->featured_image}").'" type="image/jpeg"/>';
            }
            $xml .= '<author><![CDATA['.($blog->user?->name ?? 'Inmobiliaria Vergara y Abogados').']]></author>';
            $xml .= '</item>';
        }

        $xml .= '</channel>';
        $xml .= '</rss>';

        return $xml;
    }
}
