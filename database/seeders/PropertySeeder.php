<?php

namespace Database\Seeders;

use App\Models\Property;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $properties = [
            [
                'name' => 'Modern Apartment',
                'type' => 'Apartment',
                'thumbnail' => 'properties/apartment1.jpg',
                'gallery' => json_encode(['properties/apartment1.jpg', 'properties/apartment2.jpg']),
                'price' => 120000,
                'size' => '85 m²',
                'description' => 'A cozy modern apartment in the city center.',
                'certification' => 'Energy Class A',
            ],
            [
                'name' => 'Luxury Villa',
                'type' => 'Villa',
                'thumbnail' => 'properties/villa1.jpg',
                'gallery' => json_encode(['properties/villa1.jpg', 'properties/villa2.jpg']),
                'price' => 980000,
                'size' => '450 m²',
                'description' => 'Spacious villa with swimming pool and garden.',
                'certification' => 'Energy Class A+',
            ],
            [
                'name' => 'Country House',
                'type' => 'House',
                'thumbnail' => 'properties/country1.jpg',
                'gallery' => json_encode(['properties/country1.jpg', 'properties/country2.jpg']),
                'price' => 250000,
                'size' => '180 m²',
                'description' => 'Peaceful house surrounded by nature.',
                'certification' => 'Energy Class B',
            ],
            [
                'name' => 'Beachfront Condo',
                'type' => 'Condo',
                'thumbnail' => 'properties/condo1.jpg',
                'gallery' => json_encode(['properties/condo1.jpg', 'properties/condo2.jpg']),
                'price' => 550000,
                'size' => '120 m²',
                'description' => 'Condo with amazing ocean view.',
                'certification' => 'Energy Class A',
            ],
            [
                'name' => 'Downtown Loft',
                'type' => 'Loft',
                'thumbnail' => 'properties/loft1.jpg',
                'gallery' => json_encode(['properties/loft1.jpg', 'properties/loft2.jpg']),
                'price' => 400000,
                'size' => '95 m²',
                'description' => 'Stylish loft in the heart of downtown.',
                'certification' => 'Energy Class B',
            ],
            [
                'name' => 'Suburban Home',
                'type' => 'House',
                'thumbnail' => 'properties/home1.jpg',
                'gallery' => json_encode(['properties/home1.jpg', 'properties/home2.jpg']),
                'price' => 300000,
                'size' => '160 m²',
                'description' => 'Family-friendly home in the suburbs.',
                'certification' => 'Energy Class C',
            ],
            [
                'name' => 'Mountain Cabin',
                'type' => 'Cabin',
                'thumbnail' => 'properties/cabin1.jpg',
                'gallery' => json_encode(['properties/cabin1.jpg', 'properties/cabin2.jpg']),
                'price' => 180000,
                'size' => '75 m²',
                'description' => 'Rustic cabin with stunning mountain views.',
                'certification' => 'Energy Class D',
            ],
            [
                'name' => 'Penthouse Suite',
                'type' => 'Penthouse',
                'thumbnail' => 'properties/penthouse1.jpg',
                'gallery' => json_encode(['properties/penthouse1.jpg', 'properties/penthouse2.jpg']),
                'price' => 1200000,
                'size' => '300 m²',
                'description' => 'Exclusive penthouse with luxury amenities.',
                'certification' => 'Energy Class A+',
            ],
            [
                'name' => 'Studio Apartment',
                'type' => 'Studio',
                'thumbnail' => 'properties/studio1.jpg',
                'gallery' => json_encode(['properties/studio1.jpg', 'properties/studio2.jpg']),
                'price' => 150000,
                'size' => '40 m²',
                'description' => 'Compact and affordable studio.',
                'certification' => 'Energy Class B',
            ],
            [
                'name' => 'Historic Mansion',
                'type' => 'Mansion',
                'thumbnail' => 'properties/mansion1.jpg',
                'gallery' => json_encode(['properties/mansion1.jpg', 'properties/mansion2.jpg']),
                'price' => 750000,
                'size' => '600 m²',
                'description' => 'Elegant mansion with historic charm.',
                'certification' => 'Energy Class C',
            ],
        ];

        foreach ($properties as $property) {
            Property::create($property);
        }
    }
}
