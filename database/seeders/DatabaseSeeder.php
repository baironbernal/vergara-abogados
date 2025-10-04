<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            LawyerSeeder::class,
            ServiceSeeder::class,
            StatesTableSeeder::class,
            PropertySeeder::class,
            PageSeeder::class,
        ]);
    }
}
