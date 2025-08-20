<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'Compra y Venta de Propiedades',
                'category' => 'Inmobiliario',
                'subcategory' => null,
                'description' => 'Acompañamiento completo durante todo el proceso de compra o venta de inmuebles.',
                'type' => 'Servicio',
            ],
            [
                'name' => 'Publicidad Inmobiliaria',
                'category' => 'Inmobiliario',
                'subcategory' => null,
                'description' => 'Servicio completo de promoción y publicidad de inmuebles.',
                'type' => 'Servicio',
            ],
            [
                'name' => 'Derecho Civil',
                'category' => 'Legal',
                'subcategory' => null,
                'description' => 'Asesoría y representación en asuntos civiles como contratos, herencias y disputas.',
                'type' => 'Servicio',
            ],
            [
                'name' => 'Divorcios',
                'category' => 'Legal',
                'subcategory' => 'Derecho de Familia',
                'description' => 'Manejo de divorcios de mutuo acuerdo o contenciosos.',
                'type' => 'Servicio',
            ],
            [
                'name' => 'Saneamiento Jurídico de Propiedades',
                'category' => 'Legal',
                'subcategory' => 'Derecho Inmobiliario',
                'description' => 'Regularización de aspectos legales que afectan un inmueble.',
                'type' => 'Servicio',
            ],
            // Puedes agregar todos los demás servicios aquí
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
