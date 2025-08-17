<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Citation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'lawyer_id',
        'starts_at',
        'ends_at',
        'observations',
    ];

    public function lawyer()
    {
        return $this->belongsTo(Lawyer::class);
    }
}
