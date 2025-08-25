<?php

namespace Database\Seeders;

use App\Models\Municipality;
use App\Models\State;
use Illuminate\Support\Facades\File;
use Illuminate\Database\Seeder;

class StatesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = base_path('public/colombia_municipalities.json');
        $data = json_decode(File::get($path), true);

        foreach ($data as $stateData) {
            $state = State::firstOrCreate(['name' => $stateData['departamento']]);
        
            if (!empty($stateData['ciudades'])) {
                foreach ($stateData['ciudades'] as $municipality) {
                    Municipality::firstOrCreate([
                        'state_id'  => $state->id,
                        'name'  => $municipality,
                    ]);
                }
            }
        }
    }
}
