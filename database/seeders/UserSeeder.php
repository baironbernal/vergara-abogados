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
            $lawyerUser = User::firstOrCreate(
                ['email' => $lawyerData['email']],
                [
                    'name' => $lawyerData['name'],
                    'password' => Hash::make('123456'),
                ]
            );
            $lawyerUser->assignRole('lawyer');

            // Create or update the corresponding lawyer profile
            Lawyer::firstOrCreate(
                ['email' => $lawyerData['email']],
                [
                    'name' => $lawyerData['name'],
                    'profession' => 'Abogado',
                    'description' => 'Abogado especializado en derecho inmobiliario',
                    'phone' => '+57 300 000 0000',
                    'user_id' => $lawyerUser->id,
                ]
            );
        }
    }
}
