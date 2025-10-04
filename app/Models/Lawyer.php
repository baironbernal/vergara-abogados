<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Lawyer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'profession',
        'title',
        'description',
        'bio',
        'phone',
        'email',
        'image',
        'user_id',
        'education',
        'experience',
        'specializations',
        'achievements',
        'social_media',
        'linkedin',
        'facebook',
        'twitter',
        'instagram',
        'years_experience',
        'cases_won',
        'office_location',
        'office_hours',
        'is_featured',
        'order',
    ];

    protected $casts = [
        'education' => 'array',
        'experience' => 'array',
        'specializations' => 'array',
        'achievements' => 'array',
        'social_media' => 'array',
        'is_featured' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($lawyer) {
            if (!$lawyer->slug) {
                $lawyer->slug = Str::slug($lawyer->name);
            }
        });

        static::updating(function ($lawyer) {
            if ($lawyer->isDirty('name') && !$lawyer->isDirty('slug')) {
                $lawyer->slug = Str::slug($lawyer->name);
            }
        });
    }

    public function citations()
    {
        return $this->hasMany(Citation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }
}
