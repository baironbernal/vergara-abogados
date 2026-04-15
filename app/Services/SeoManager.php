<?php

namespace App\Services;

/**
 * Stores SEO data set by a controller so the blade template can inject
 * it into the <head> on the server — no Node.js or SSR required.
 *
 * Usage in a controller:
 *   SeoManager::set($seo);                   // meta title/description/keywords
 *   SeoManager::setSchema($schemaArray);      // JSON-LD structured data (optional)
 *
 * Usage in blade:
 *   SeoManager::title()
 *   SeoManager::description()
 *   SeoManager::schema()
 */
class SeoManager
{
    private static array $meta = [];

    private static array $schemas = [];

    public static function set(array $seo): void
    {
        self::$meta = $seo;
        self::$schemas = []; // reset schemas on each new page
    }

    /**
     * Add a schema to the list. Can be called multiple times to add multiple schemas.
     *
     * @param  mixed  $schema  Array schema structure
     */
    public static function setSchema(mixed $schema): void
    {
        self::$schemas[] = $schema;
    }

    public static function title(): string
    {
        return self::$meta['title']
            ?? 'Inmobiliaria Vergara y Abogados — Abogados Inmobiliarios en Soacha, Cundinamarca';
    }

    public static function description(): string
    {
        return self::$meta['description']
            ?? 'Firma de abogados especializada en derecho inmobiliario en Soacha, Cundinamarca, Colombia. '
             .'Compra, venta, arriendo y asesoría jurídica de propiedades. ¡Agenda tu cita hoy!';
    }

    public static function keywords(): string
    {
        return self::$meta['keywords'] ?? '';
    }

    /** Returns the current URL without query string — safe for canonical tags. */
    public static function canonical(): string
    {
        return request()->url();
    }

    /**
     * Returns all schemas as JSON string, or a single schema if only one exists.
     * This handles both single and multiple schema scenarios for JSON-LD.
     */
    public static function schema(): mixed
    {
        if (empty(self::$schemas)) {
            return null;
        }

        // If only one schema, return it directly (most common case)
        if (count(self::$schemas) === 1) {
            return self::$schemas[0];
        }

        // Multiple schemas - wrap in an array
        return self::$schemas;
    }
}
