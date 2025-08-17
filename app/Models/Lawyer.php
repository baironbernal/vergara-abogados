<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lawyer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'profession',
        'phone',
        'email',
        'image',
    ];

    public function citations()
    {
        return $this->hasMany(Citation::class);
    }
}
