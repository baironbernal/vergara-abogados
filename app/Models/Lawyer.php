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
        'description',
        'phone',
        'email',
        'image',
        'user_id',
    ];

    public function citations()
    {
        return $this->hasMany(Citation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getImageAttribute($value)
    {
        if ($value) {
            // Check if the value is already a full URL (starts with http or https)
            if (str_starts_with($value, 'http')) {
                return $value;
            }
            return asset('storage/' . $value);
        }
        return null;
    }
}
