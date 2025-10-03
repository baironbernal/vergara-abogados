<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
