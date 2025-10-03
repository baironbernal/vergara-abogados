<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'name' => 'Home',
                'route' => '/',
                'seo' => [
                    'title' => 'Inmobiliaria Vergara - Expertos en Asesoría Jurídica Inmobiliaria',
                    'description' => 'Inmobiliaria Vergara ofrece servicios legales especializados en derecho inmobiliario. Compra, venta y asesoría legal de propiedades con profesionales expertos.',
                    'keywords' => 'inmobiliaria, asesoría jurídica, derecho inmobiliario, abogados, propiedades, bienes raíces',
                ],
            ],
            [
                'name' => 'Acerca de Nosotros',
                'route' => '/acerca',
                'seo' => [
                    'title' => 'Acerca de Nosotros - Inmobiliaria Vergara',
                    'description' => 'Conoce a nuestro equipo de abogados especializados en derecho inmobiliario. Experiencia, profesionalismo y compromiso en cada caso.',
                    'keywords' => 'acerca de, equipo legal, abogados inmobiliarios, profesionales, inmobiliaria vergara',
                ],
            ],
            [
                'name' => 'Contacto',
                'route' => '/contacto',
                'seo' => [
                    'title' => 'Contacto - Agenda tu Cita Legal - Inmobiliaria Vergara',
                    'description' => 'Agenda tu cita con nuestros expertos en derecho inmobiliario. Consulta legal profesional, asesoría personalizada y soluciones a tus necesidades inmobiliarias.',
                    'keywords' => 'contacto, cita legal, asesoría inmobiliaria, consulta abogados, agenda cita, derecho inmobiliario',
                ],
            ],
            [
                'name' => 'Servicios',
                'route' => '/servicios',
                'seo' => [
                    'title' => 'Servicios Legales Inmobiliarios - Inmobiliaria Vergara',
                    'description' => 'Servicios legales especializados en derecho inmobiliario. Asesoría jurídica, trámites de propiedades, contratos y más servicios legales profesionales.',
                    'keywords' => 'servicios legales, derecho inmobiliario, asesoría jurídica, trámites propiedades, contratos inmobiliarios, abogados',
                ],
            ],
            [
                'name' => 'Propiedades',
                'route' => '/inmobiliaria',
                'seo' => [
                    'title' => 'Propiedades en Venta y Alquiler - Inmobiliaria Vergara',
                    'description' => 'Explora nuestra amplia selección de propiedades en venta y alquiler en Colombia. Casas, apartamentos, locales comerciales y más con asesoría legal especializada.',
                    'keywords' => 'propiedades en venta, propiedades en alquiler, casas, apartamentos, locales comerciales, bienes raíces Colombia',
                ],
            ],
            [
                'name' => 'Blog',
                'route' => '/blog',
                'seo' => [
                    'title' => 'Blogs y casos',
                    'description' => 'Blogs y casos ',
                    'keywords' => 'inmobiliaria, asesoría jurídica, derecho inmobiliario, abogados, propiedades, bienes raíces, Soacha, Soacha Cundinamarca',
                ],
            ],
        ];

        foreach ($pages as $page) {
            Page::updateOrCreate(
                ['route' => $page['route']],
                $page
            );
        }
    }
}
