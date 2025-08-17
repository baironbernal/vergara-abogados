<?php

namespace Database\Seeders;

use App\Models\User;
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
        $admin = User::firstOrCreate(
            ['email' => 'admin@abogadosvergara.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('123456'),
            ]
        );
        $admin->assignRole('admin');

        
        $lawyers = [
            [
                'name' => 'Dayana Vergara',
                'email' => 'dayana.vergara@abogadosvergara.com',
            ],
            [
                'name' => 'Brian Vergara',
                'email' => 'brayan.vergara@abogadosvergara.com',
            ],
            [
                'name' => 'Elvis Vergara',
                'email' => 'elvis.vergara@abogadosvergara.com',
            ],
        ];

        foreach ($lawyers as $lawyerData) {
            $lawyer = User::firstOrCreate(
                ['email' => $lawyerData['email']],
                [
                    'name' => $lawyerData['name'],
                    'password' => Hash::make('123456'),
                ]
            );
            $lawyer->assignRole('lawyer');
        }
    }
}
