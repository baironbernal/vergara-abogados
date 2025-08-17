<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $fillable = [
        'name',
        'type',
        'thumbnail',
        'gallery',
        'price',
        'size',
        'description',
        'certification',
    ];

    protected $casts = [
        'gallery' => 'json', 
    ];

}
