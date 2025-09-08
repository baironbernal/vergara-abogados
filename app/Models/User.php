<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;


    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Determine if the user can access the Filament panel.
     */
    public function canAccessPanel(Panel $panel): bool
    {
        // Opción 1: Permitir acceso a todos los usuarios autenticados
        return true;
        
        // Opción 2: Solo usuarios con email específico
        // return str_ends_with($this->email, '@inmobiliariavergarayabogados.com.co');
        
        // Opción 3: Solo usuarios con rol de admin (si usas roles)
        // return $this->hasRole('admin');
        
        // Opción 4: Solo emails específicos
        // return in_array($this->email, [
        //     'admin@inmobiliariavergarayabogados.com.co',
        //     'tu-email@ejemplo.com'
        // ]);
    }
}
