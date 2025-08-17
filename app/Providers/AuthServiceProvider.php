<?php

namespace App\Providers;

use App\Models\Lawyer;
use App\Policies\LawyerPolicy;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;



class AuthServiceProvider extends ServiceProvider
{
   

    protected $policies = [
        Lawyer::class => LawyerPolicy::class,
    
    ];

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
    }
}
