<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'property_id',
        'visit_date',
        'visit_time',
        'observations',
        'status',
    ];

    protected $casts = [
        'visit_date' => 'date',
        'visit_time' => 'time',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function getStatusLabelAttribute()
    {
        return match($this->status) {
            'pending' => 'Pendiente',
            'confirmed' => 'Confirmada',
            'cancelled' => 'Cancelada',
            default => 'Pendiente',
        };
    }
}
