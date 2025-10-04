<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        // Common location keywords for all pages
        $locationKeywords = 'abogados en soacha, abogados soacha cundinamarca, soacha, soacha cundinamarca, cundinamarca, sabana de bogotá, área metropolitana de bogotá, municipios aledaños a bogotá';

        $pages = [
            [
                'name' => 'Home',
                'route' => '/',
                'seo' => [
                    'title' => 'Inmobiliaria Vergara - Abogados Inmobiliarios en Soacha Cundinamarca',
                    'description' => 'Bufete de abogados inmobiliarios en Soacha. Asesoría legal para compra y venta de propiedades. Expertos en escrituración, trámites inmobiliarios y derecho notarial.',
                    'keywords' => 'abogados en soacha, abogados soacha cundinamarca, bufete de abogados soacha, abogados cerca de mí soacha, estudio jurídico soacha, asesoría legal soacha, consulta jurídica soacha, mejores abogados de soacha, abogados inmobiliarios soacha, inmobiliaria vergara, abogado compra venta inmuebles soacha, asesoría legal inmobiliaria soacha, ' . $locationKeywords,
                ],
            ],
            [
                'name' => 'Acerca de Nosotros',
                'route' => '/acerca',
                'seo' => [
                    'title' => 'Nuestro Equipo - Bufete de Abogados Inmobiliarios Soacha',
                    'description' => 'Conoce a nuestro equipo de abogados especializados en derecho inmobiliario en Soacha. Experiencia, profesionalismo y compromiso en cada caso.',
                    'keywords' => 'bufete de abogados soacha, estudio jurídico soacha, equipo legal, abogados inmobiliarios soacha, profesionales derecho inmobiliario, mejores abogados de soacha, abogado recomendado soacha, ' . $locationKeywords,
                ],
            ],
            [
                'name' => 'Contacto',
                'route' => '/contacto',
                'seo' => [
                    'title' => 'Contacto - Consulta Jurídica en Soacha | Inmobiliaria Vergara',
                    'description' => 'Agenda tu consulta jurídica en Soacha. Asesoría legal inmobiliaria personalizada. Estamos ubicados en el centro de Soacha, Cundinamarca.',
                    'keywords' => 'consulta jurídica soacha, asesoría legal soacha, contacto abogados soacha, abogados cerca de mí soacha, conseguir abogado soacha, necesito abogado en soacha, dónde encontrar abogado soacha, centro de soacha, soacha centro, ' . $locationKeywords,
                ],
            ],
            [
                'name' => 'Servicios',
                'route' => '/servicios',
                'seo' => [
                    'title' => 'Servicios Legales Inmobiliarios en Soacha | Escrituración y Trámites',
                    'description' => 'Servicios legales especializados: escrituración, trámites inmobiliarios, promesa de compraventa, revisión de contratos. Asesoría legal completa en Soacha.',
                    'keywords' => 'abogado escrituras soacha, escrituración soacha, abogado notarial soacha, trámites legales para comprar vivienda soacha, abogado trámites inmobiliarios soacha, promesa de compraventa soacha, abogado para revisar contrato de compraventa soacha, cuánto cobra un abogado por escrituras en soacha, verificar títulos de propiedad soacha, certificado de tradición y libertad soacha, notaría soacha, registro de instrumentos públicos soacha, ' . $locationKeywords,
                ],
            ],
            [
                'name' => 'Propiedades',
                'route' => '/inmobiliaria',
                'seo' => [
                    'title' => 'Propiedades en Venta Soacha Cundinamarca | Casas y Apartamentos',
                    'description' => 'Comprar casa en Soacha con asesoría legal incluida. Casas, apartamentos y proyectos de vivienda en todas las comunas. Precios económicos y subsidio de vivienda.',
                    'keywords' => 'comprar casa en soacha, comprar apartamento en soacha, venta de casas en soacha cundinamarca, propiedades en venta soacha, inmuebles en soacha, finca raíz soacha, casas baratas en soacha, apartamentos económicos soacha, vivienda de interés social soacha, vis en soacha, proyectos de vivienda soacha, casas en venta soacha cundinamarca precios, propiedades económicas soacha, apartamentos nuevos en soacha, proyectos de vivienda sobre planos soacha, cuánto cuesta una casa en soacha, subsidio de vivienda en soacha, ciudad verde soacha, compartir soacha, comuna 1 soacha, comuna 2 soacha, comuna 3 soacha, comuna 4 soacha, comuna 5 soacha, comuna 6 soacha, ' . $locationKeywords,
                ],
            ],
            [
                'name' => 'Blog',
                'route' => '/blog',
                'seo' => [
                    'title' => 'Blog Legal Inmobiliario - Consejos para Comprar Casa en Soacha',
                    'description' => 'Artículos y casos de éxito. Aprende cómo comprar casa sin estafa, qué necesitas para comprar vivienda y trámites legales en Soacha.',
                    'keywords' => 'cómo comprar casa en soacha, qué necesito para comprar casa en soacha, es seguro comprar en soacha, cuánto demora comprar una casa en soacha, cómo comprar casa sin estafa en soacha, asesoría legal para comprar casa usada soacha, qué abogado me recomienda para comprar casa, comprar casa con abogado soacha, blog inmobiliario soacha, ' . $locationKeywords,
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
