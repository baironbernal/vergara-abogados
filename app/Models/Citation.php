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
        'blocked_by_user',
        'blocked_by_user_id',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'blocked_by_user' => 'boolean',
    ];

    public function lawyer()
    {
        return $this->belongsTo(Lawyer::class);
    }

    public function blockedByUser()
    {
        return $this->belongsTo(User::class, 'blocked_by_user_id');
    }
}
