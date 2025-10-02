<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Information extends Model
{
    use HasFactory;

    protected $table = 'information';

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
