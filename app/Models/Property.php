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
            // Check if the value is already a full URL
            if (str_starts_with($image, 'http')) {
                return $image;
            }
            return asset('storage/' . $image);
        }, $this->gallery);
    }

    public function getThumbnailUrlAttribute()
    {
        if (!$this->thumbnail) {
            return '/images/shared/background-title.webp';
        }
        
        // Check if the value is already a full URL
        if (str_starts_with($this->thumbnail, 'http')) {
            return $this->thumbnail;
        }
        
        return asset('storage/' . $this->thumbnail);
    }
}
