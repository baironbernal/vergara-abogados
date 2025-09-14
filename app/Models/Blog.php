<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class Blog extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'gallery',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'status',
        'featured',
        'published_at',
        'user_id',
    ];

    protected $casts = [
        'gallery' => 'json',
        'featured' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($blog) {
            if (!$blog->slug) {
                $blog->slug = Str::slug($blog->title);
            }
        });

        static::updating(function ($blog) {
            if ($blog->isDirty('title') && !$blog->isDirty('slug')) {
                $blog->slug = Str::slug($blog->title);
            }
        });
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopePublished(Builder $query)
    {
        return $query->where('status', 'published')
            ->where('published_at', '<=', now());
    }

    public function scopeFeatured(Builder $query)
    {
        return $query->where('featured', true);
    }

    public function scopeLatest(Builder $query)
    {
        return $query->orderBy('published_at', 'desc');
    }

    // Accessors
    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getFeaturedImageUrlAttribute()
    {
        return $this->featured_image ? asset('storage/' . $this->featured_image) : '/images/shared/background-title.webp';
    }

    public function getExcerptAttribute($value)
    {
        return $value ?: Str::limit(strip_tags($this->content), 200);
    }

    public function getReadingTimeAttribute()
    {
        $wordCount = str_word_count(strip_tags($this->content));
        $minutes = ceil($wordCount / 200); // Average reading speed
        return $minutes;
    }

    public function getGalleryImagesAttribute()
    {
        if (!$this->gallery || !is_array($this->gallery)) {
            return [];
        }

        return array_map(function($image) {
            return asset('storage/' . $image);
        }, $this->gallery);
    }
}
