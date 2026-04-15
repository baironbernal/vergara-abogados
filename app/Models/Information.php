<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Information extends Model
{
    use HasFactory;

    protected $table = 'information';

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('corporative_info'));
        static::deleted(fn () => Cache::forget('corporative_info'));
    }

    protected $fillable = [
        'corporative_email',
        'corporative_whatsapp',
        'corporative_linkedin',
        'corporative_instagram',
        'corporative_facebook',
        'corporative_twitter',
        'copyright_text',
        'office_address',
    ];
}
