<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Property extends Model
{
    protected $fillable = [
        'name',
        'type',
        'thumbnail',
        'gallery',
        'price',
        'size',
        'municipality_id',
        'state_id',
        'description',
    ];

    protected $casts = [
        'gallery' => 'json', 
    ];


    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function state()
    {
        return $this->belongsTo(State::class);
    }

    public function getFormattedPriceAttribute()
    {
        return number_format($this->price, 0, ',', '.');
    }

    public function getPropertyTypeAttribute()
    {
        return $this->type ?? 'Propiedad';
    }

    public function getGalleryImagesAttribute()
    {
        if (!$this->gallery || !is_array($this->gallery)) {
            return [];
        }

        return array_map(function($image) {
            return Storage::disk('public')->url($image);
        }, $this->gallery);
    }

    public function getThumbnailUrlAttribute()
    {
        return $this->thumbnail ? Storage::disk('public')->url($this->thumbnail) : '/images/shared/background-title.webp';
    }
}
