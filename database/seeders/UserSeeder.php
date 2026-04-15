<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Lawyer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $initialPassword = env('ADMIN_INITIAL_PASSWORD');

        if (empty($initialPassword)) {
            throw new \RuntimeException(
                'ADMIN_INITIAL_PASSWORD env variable must be set before running seeders.'
            );
        }

        $admin = User::firstOrCreate(
            ['email' => 'admin@inmobiliariavergarayabogados.com'],
            [
                'name'     => 'Admin',
                'password' => Hash::make($initialPassword),
            ]
        );
        $admin->assignRole('admin');


    }
}
