<?php

namespace Database\Seeders;

use App\Models\Municipality;
use App\Models\Property;
use App\Models\State;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        $stateId = State::inRandomOrder()->value('id');
        $municipalityId = Municipality::inRandomOrder()->value('id');

        for ($i = 1; $i <= 10; $i++) {
            Property::create([
                'name' => 'Property ' . $i,
                'type' => fake()->randomElement(['House', 'Apartment', 'Farm', 'Lot']),
                'thumbnail' => fake()->imageUrl(640, 480, 'real-estate', true, 'Thumbnail'),
                'gallery' => [
                    fake()->imageUrl(640, 480, 'real-estate', true, 'Gallery 1'),
                    fake()->imageUrl(640, 480, 'real-estate', true, 'Gallery 2'),
                ],
                'price' => fake()->numberBetween(50000, 500000),
                'size' => fake()->randomFloat(2, 50, 500), // size between 50 and 500 m²
                'description' => fake()->sentence(15),
                'state_id' => $stateId,
                'municipality_id' => $municipalityId,
                'ubication' => fake()->city(),
            ]);
        }
    }
}
