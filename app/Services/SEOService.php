<?php

namespace App\Services;

class SEOService
{
    public static function generateMetaTags(array $data = []): array
    {
        $defaults = [
            'title' => 'Inmobiliaria Vergara - Expertos en Bienes Raíces y Derecho Inmobiliario',
            'description' => 'Inmobiliaria Vergara ofrece servicios integrales de bienes raíces y asesoría legal especializada. Propiedades en venta, alquiler y servicios jurídicos inmobiliarios en Colombia.',
            'keywords' => 'inmobiliaria, bienes raíces, propiedades, venta, alquiler, derecho inmobiliario, asesoría legal, Colombia',
            'image' => '/images/shared/background-title.webp',
            'url' => request()->url(),
            'type' => 'website',
            'site_name' => 'Inmobiliaria Vergara',
            'locale' => 'es_CO',
        ];

        $meta = array_merge($defaults, $data);

        return [
            'title' => $meta['title'],
            'meta' => [
                ['name' => 'description', 'content' => $meta['description']],
                ['name' => 'keywords', 'content' => $meta['keywords']],
                ['name' => 'author', 'content' => 'Inmobiliaria Vergara'],
                ['name' => 'viewport', 'content' => 'width=device-width, initial-scale=1.0'],
                ['name' => 'robots', 'content' => 'index, follow'],
                ['name' => 'language', 'content' => 'es'],
                ['name' => 'geo.region', 'content' => 'CO'],
                ['name' => 'geo.placename', 'content' => 'Colombia'],
                
                // Open Graph
                ['property' => 'og:title', 'content' => $meta['title']],
                ['property' => 'og:description', 'content' => $meta['description']],
                ['property' => 'og:image', 'content' => url($meta['image'])],
                ['property' => 'og:url', 'content' => $meta['url']],
                ['property' => 'og:type', 'content' => $meta['type']],
                ['property' => 'og:site_name', 'content' => $meta['site_name']],
                ['property' => 'og:locale', 'content' => $meta['locale']],
                
                // Twitter Card
                ['name' => 'twitter:card', 'content' => 'summary_large_image'],
                ['name' => 'twitter:title', 'content' => $meta['title']],
                ['name' => 'twitter:description', 'content' => $meta['description']],
                ['name' => 'twitter:image', 'content' => url($meta['image'])],
                
                // Additional SEO
                ['name' => 'theme-color', 'content' => '#1f2937'],
                ['name' => 'msapplication-TileColor', 'content' => '#1f2937'],
            ],
            'canonical' => $meta['url'],
            'structured_data' => $meta['structured_data'] ?? null,
        ];
    }

    public static function generatePropertySEO($property): array
    {
        $title = "{$property->name} - {$property->property_type} en {$property->municipality->name} - Inmobiliaria Vergara";
        $description = "Descubre esta {$property->property_type} en {$property->municipality->name}, {$property->state->name}. Precio: $" . number_format($property->price, 0, ',', '.') . " COP. Contacta con Inmobiliaria Vergara para más información.";
        $keywords = "{$property->property_type}, {$property->municipality->name}, {$property->state->name}, bienes raíces, inmobiliaria, venta, alquiler, Colombia, {$property->name}";
        
        $image = $property->images && count($property->images) > 0 
            ? url($property->images[0]) 
            : url('/images/shared/background-title.webp');

        $structuredData = [
            "@context" => "https://schema.org",
            "@type" => "RealEstateListing",
            "name" => $property->name,
            "description" => $property->description ?? $description,
            "image" => $property->images ? array_map(function($img) { return url($img); }, $property->images) : [url('/images/shared/background-title.webp')],
            "url" => url("/inmobiliaria/{$property->id}"),
            "address" => [
                "@type" => "PostalAddress",
                "addressLocality" => $property->municipality->name,
                "addressRegion" => $property->state->name,
                "addressCountry" => "CO"
            ],
            "offers" => [
                "@type" => "Offer",
                "price" => $property->price,
                "priceCurrency" => "COP",
                "availability" => "https://schema.org/InStock",
                "seller" => [
                    "@type" => "RealEstateAgent",
                    "name" => "Inmobiliaria Vergara"
                ]
            ],
            "floorSize" => [
                "@type" => "QuantitativeValue",
                "value" => $property->size ?? null,
                "unitCode" => "MTK"
            ],
            "category" => $property->property_type,
            "provider" => [
                "@type" => "RealEstateAgent", 
                "name" => "Inmobiliaria Vergara",
                "url" => url('/'),
                "address" => [
                    "@type" => "PostalAddress",
                    "addressCountry" => "CO"
                ]
            ]
        ];

        // Remove null values
        $structuredData = array_filter($structuredData, function($value) {
            return $value !== null && $value !== '';
        });

        return self::generateMetaTags([
            'title' => $title,
            'description' => $description,
            'keywords' => $keywords,
            'image' => $image,
            'type' => 'article',
            'structured_data' => $structuredData,
        ]);
    }

    public static function generateServiceSEO($service): array
    {
        $title = "{$service->name} - Servicios Legales - Inmobiliaria Vergara";
        $description = $service->description ?? "Servicios profesionales de {$service->name} en derecho inmobiliario. Asesoría legal especializada con Inmobiliaria Vergara.";
        $keywords = "{$service->name}, servicios legales, derecho inmobiliario, asesoría legal, abogados, Colombia";

        $structuredData = [
            "@context" => "https://schema.org",
            "@type" => "Service",
            "name" => $service->name,
            "description" => $description,
            "provider" => [
                "@type" => "LegalService",
                "name" => "Inmobiliaria Vergara",
                "url" => url('/'),
                "areaServed" => "CO"
            ]
        ];

        return self::generateMetaTags([
            'title' => $title,
            'description' => $description,
            'keywords' => $keywords,
            'type' => 'service',
            'structured_data' => $structuredData,
        ]);
    }

    public static function generateLawyerSEO($lawyer): array
    {
        $title = "Abogado {$lawyer->name} - Especialista en Derecho Inmobiliario - Inmobiliaria Vergara";
        $description = "Conoce al abogado {$lawyer->name}, especialista en derecho inmobiliario. Experiencia profesional en bienes raíces y servicios legales con Inmobiliaria Vergara.";
        $keywords = "abogado, {$lawyer->name}, derecho inmobiliario, servicios legales, bienes raíces, Colombia";

        $structuredData = [
            "@context" => "https://schema.org",
            "@type" => "Person",
            "name" => $lawyer->name,
            "jobTitle" => "Abogado Especialista en Derecho Inmobiliario",
            "worksFor" => [
                "@type" => "Organization",
                "name" => "Inmobiliaria Vergara"
            ],
            "email" => $lawyer->email ?? null,
            "telephone" => $lawyer->phone ?? null
        ];

        return self::generateMetaTags([
            'title' => $title,
            'description' => $description,
            'keywords' => $keywords,
            'type' => 'profile',
            'structured_data' => $structuredData,
        ]);
    }

    public static function getOrganizationStructuredData(): array
    {
        return [
            "@context" => "https://schema.org",
            "@type" => "RealEstateAgent",
            "name" => "Inmobiliaria Vergara",
            "description" => "Expertos en bienes raíces y derecho inmobiliario en Colombia. Servicios integrales de compra, venta y asesoría legal especializada.",
            "url" => url('/'),
            "logo" => url('/logo.webp'),
            "image" => url('/images/shared/background-title.webp'),
            "address" => [
                "@type" => "PostalAddress",
                "streetAddress" => "Cl. 12 #8 05",
                "addressLocality" => "Soacha",
                "addressRegion" => "Cundinamarca",
                "addressCountry" => "CO"
            ],
            "contactPoint" => [
                "@type" => "ContactPoint",
                "telephone" => "1-258-987-000",
                "contactType" => "customer service",
                "availableLanguage" => "Spanish"
            ],
            "areaServed" => "CO",
            "hasOfferCatalog" => [
                "@type" => "OfferCatalog",
                "name" => "Servicios Inmobiliarios",
                "itemListElement" => [
                    [
                        "@type" => "Offer",
                        "itemOffered" => [
                            "@type" => "Service",
                            "name" => "Compra y Venta de Propiedades"
                        ]
                    ],
                    [
                        "@type" => "Offer", 
                        "itemOffered" => [
                            "@type" => "Service",
                            "name" => "Asesoría Legal Inmobiliaria"
                        ]
                    ],
                    [
                        "@type" => "Offer",
                        "itemOffered" => [
                            "@type" => "Service", 
                            "name" => "Servicios Jurídicos"
                        ]
                    ]
                ]
            ]
        ];
    }
}