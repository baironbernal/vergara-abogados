<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:admin-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create an admin user for Filament panel';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->ask('Name');
        $email = $this->ask('Email address');
        $password = $this->secret('Password');

        if (\App\Models\User::where('email', $email)->exists()) {
            $this->error('A user with this email already exists!');
            return 1;
        }

        $user = \App\Models\User::create([
            'name' => $name,
            'email' => $email,
            'password' => bcrypt($password),
        ]);

        $this->info('Admin user created successfully!');
        $this->line('Name: ' . $user->name);
        $this->line('Email: ' . $user->email);

        return 0;
    }
}
