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



}
