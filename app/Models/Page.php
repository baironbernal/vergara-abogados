<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Page extends Model
{
    protected $fillable = [
        'name',
        'route',
        'seo',
    ];

    protected $casts = [
        'seo' => 'array',
    ];

    protected static function booted(): void
    {
        $bust = fn (self $page) => Cache::forget("page_seo_{$page->route}");
        static::saved($bust);
        static::deleted($bust);
    }
}
