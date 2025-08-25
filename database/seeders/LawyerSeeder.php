<?php

namespace Database\Seeders;

use App\Models\Lawyer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LawyerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lawyers = [
            [
                'name'       => 'Bryan Vergara',
                'profession' => 'Corporate Lawyer',
                'phone'      => '+1 555-123-4567',
                'email'      => 'john.doe@example.com',
                'image'      => 'lawyers/john_doe.jpg',
            ],
            [
                'name'       => 'Elvis Vergara',
                'profession' => 'Corporate Lawyer',
                'phone'      => '+1 555-987-6543',
                'email'      => 'jane.smith@example.com',
                'image'      => 'lawyers/jane_smith.jpg',
            ],
            [
                'name'       => 'Ivon Vergara',
                'profession' => 'Family Lawyer',
                'phone'      => '+57 300-555-9988',
                'email'      => 'carlos.gomez@example.com',
                'image'      => 'lawyers/carlos_gomez.jpg',
            ],
        ];

        foreach ($lawyers as $lawyer) {
            Lawyer::create($lawyer);
        }
    }
}
