<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        
        if (!$user) {
            $this->command->error('No users found. Please create a user first.');
            return;
        }

        $blogs = [
            [
                'title' => '5 Consejos Esenciales para Comprar tu Primera Propiedad',
                'excerpt' => 'Descubre los aspectos más importantes que debes considerar antes de adquirir tu primera propiedad en Colombia.',
                'content' => '<h2>Introducción</h2><p>Comprar tu primera propiedad es una de las decisiones más importantes de tu vida. En Inmobiliaria Vergara, queremos ayudarte a tomar la mejor decisión con estos consejos esenciales.</p><h2>1. Define tu presupuesto real</h2><p>Antes de comenzar tu búsqueda, es fundamental que tengas claro cuánto puedes invertir. Recuerda incluir no solo el valor de la propiedad, sino también los gastos adicionales como escrituración, impuestos y seguros.</p><h2>2. Investiga la ubicación</h2><p>La ubicación es clave en el valor futuro de tu propiedad. Evalúa factores como transporte público, colegios, centros comerciales y proyectos de desarrollo urbano en la zona.</p><h2>3. Revisa la documentación legal</h2><p>Asegúrate de que la propiedad tenga todos los documentos en regla: escrituras, paz y salvo de impuestos, certificados de libertad y tradición actualizados.</p><h2>4. Inspección física detallada</h2><p>No te limites a una visita superficial. Revisa instalaciones eléctricas, tuberías, estructura y posibles humedades.</p><h2>5. Considera el potencial de valorización</h2><p>Analiza el crecimiento proyectado del sector y las inversiones en infraestructura que puedan impactar positivamente el valor de tu propiedad.</p><p>En Inmobiliaria Vergara, nuestro equipo de expertos te acompaña en cada paso del proceso de compra, brindándote asesoría legal y comercial especializada.</p>',
                'meta_title' => '5 Consejos para Comprar tu Primera Propiedad - Inmobiliaria Vergara',
                'meta_description' => 'Guía completa con 5 consejos esenciales para comprar tu primera propiedad en Colombia. Asesoría experta en bienes raíces.',
                'meta_keywords' => 'comprar primera propiedad, consejos bienes raíces, inmobiliaria Colombia, compra vivienda',
                'status' => 'published',
                'featured' => true,
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Aspectos Legales Cruciales en la Compra de Propiedades',
                'excerpt' => 'Una guía completa sobre los aspectos jurídicos que debes conocer al adquirir una propiedad.',
                'content' => '<h2>¿Por qué es importante la asesoría legal?</h2><p>La compra de una propiedad involucra múltiples aspectos legales que pueden ser complejos para una persona sin experiencia en el sector inmobiliario.</p><h2>Documentos esenciales</h2><ul><li>Escritura pública de compraventa</li><li>Certificado de libertad y tradición</li><li>Paz y salvo de impuestos prediales</li><li>Certificado de avalúo catastral</li><li>Licencias y permisos de construcción</li></ul><h2>Proceso de escrituración</h2><p>El proceso de escrituración debe realizarse ante notario público y requiere la presencia de ambas partes. Es fundamental que un abogado especializado revise todos los documentos antes de la firma.</p><h2>Impuestos y gastos adicionales</h2><p>Ten en cuenta los siguientes costos adicionales:</p><ul><li>Impuesto de beneficencia (1%)</li><li>Registro de la escritura (0.5%)</li><li>Gastos notariales</li><li>Retención en la fuente (si aplica)</li></ul><p>En Vergara y Asociados, nuestros abogados especializados en derecho inmobiliario te brindan la tranquilidad de una transacción 100% legal y segura.</p>',
                'meta_title' => 'Aspectos Legales en Compra de Propiedades - Vergara Abogados',
                'meta_description' => 'Conoce los aspectos legales cruciales en la compra de propiedades. Asesoría jurídica especializada en derecho inmobiliario.',
                'meta_keywords' => 'aspectos legales propiedades, derecho inmobiliario, escrituración, abogados inmobiliarios',
                'status' => 'published',
                'featured' => true,
                'published_at' => now()->subDays(3),
            ],
            [
                'title' => 'Tendencias del Mercado Inmobiliario en Colombia 2025',
                'excerpt' => 'Análisis de las principales tendencias y oportunidades del sector inmobiliario colombiano para el presente año.',
                'content' => '<h2>Panorama actual del mercado</h2><p>El mercado inmobiliario colombiano presenta interesantes oportunidades en 2025, con un crecimiento sostenido en diferentes segmentos.</p><h2>Segmentos en crecimiento</h2><h3>Vivienda de interés social</h3><p>Los programas gubernamentales continúan impulsando este segmento con tasas de financiación preferenciales.</p><h3>Oficinas flexibles</h3><p>El trabajo híbrido ha transformado la demanda de espacios corporativos, privilegiando la flexibilidad y ubicaciones estratégicas.</p><h3>Logística y bodegas</h3><p>El e-commerce sigue impulsando la demanda de espacios logísticos cerca de centros urbanos.</p><h2>Ciudades con mayor proyección</h2><ul><li>Bogotá: Expansión hacia municipios aledaños</li><li>Medellín: Renovación urbana del centro</li><li>Barranquilla: Crecimiento en el norte</li><li>Cali: Desarrollo del sur de la ciudad</li></ul><h2>Tecnología e innovación</h2><p>La incorporación de tecnología PropTech está revolutionando la forma en que se compran, venden y gestionan las propiedades.</p><p>Para aprovechar estas tendencias y tomar las mejores decisiones de inversión, contacta a nuestros expertos en Inmobiliaria Vergara.</p>',
                'meta_title' => 'Tendencias Mercado Inmobiliario Colombia 2025 - Inmobiliaria Vergara',
                'meta_description' => 'Descubre las principales tendencias del mercado inmobiliario colombiano en 2025. Análisis experto y oportunidades de inversión.',
                'meta_keywords' => 'mercado inmobiliario Colombia, tendencias 2025, inversión inmobiliaria, PropTech Colombia',
                'status' => 'published',
                'featured' => false,
                'published_at' => now()->subDays(1),
            ],
            [
                'title' => 'Cómo Evaluar el Valor de una Propiedad',
                'excerpt' => 'Métodos profesionales para determinar el valor real de una propiedad antes de comprar o vender.',
                'content' => '<h2>Importancia de la evaluación</h2><p>Conocer el valor real de una propiedad es fundamental tanto para compradores como vendedores. Una evaluación adecuada evita sobrepagar o subvalorar un inmueble.</p><h2>Métodos de valuación</h2><h3>Método comparativo</h3><p>Compara propiedades similares en la misma zona que se hayan vendido recientemente.</p><h3>Método de capitalización</h3><p>Utilizado principalmente para propiedades de inversión, basado en los ingresos que puede generar.</p><h3>Método de costo</h3><p>Considera el valor del terreno más el costo de construcción, menos la depreciación.</p><h2>Factores que influyen en el valor</h2><ul><li>Ubicación y conectividad</li><li>Estado de conservación</li><li>Servicios públicos disponibles</li><li>Área construida y distribución</li><li>Plusvalía del sector</li></ul><h2>Herramientas tecnológicas</h2><p>Actualmente existen plataformas digitales que facilitan la evaluación mediante algoritmos y big data inmobiliario.</p><p>En Inmobiliaria Vergara contamos con avaluadores certificados y tecnología de punta para ofrecerte evaluaciones precisas y confiables.</p>',
                'meta_title' => 'Cómo Evaluar el Valor de una Propiedad - Guía Completa',
                'meta_description' => 'Aprende los métodos profesionales para evaluar el valor de una propiedad. Guía completa con consejos de expertos inmobiliarios.',
                'meta_keywords' => 'evaluar valor propiedad, avalúo inmobiliario, métodos valuación, precio propiedad',
                'status' => 'published',
                'featured' => false,
                'published_at' => now()->subHours(12),
            ],
            [
                'title' => 'Guía Completa: Trámites para Vender tu Propiedad',
                'excerpt' => 'Todo lo que necesitas saber sobre los trámites legales y administrativos para vender tu propiedad.',
                'content' => '<h2>Preparación de documentos</h2><p>Antes de poner tu propiedad en venta, es esencial tener toda la documentación en orden.</p><h2>Documentos requeridos</h2><ul><li>Escritura pública registrada</li><li>Certificado de libertad y tradición (no mayor a 30 días)</li><li>Paz y salvo de impuestos prediales</li><li>Certificado de estratificación</li><li>Planos arquitectónicos aprobados</li><li>Licencias de construcción</li></ul><h2>Proceso de venta</h2><h3>1. Evaluación del inmueble</h3><p>Determina el precio de mercado mediante un avalúo profesional.</p><h3>2. Marketing y publicidad</h3><p>Utiliza múltiples canales para maximizar la exposición de tu propiedad.</p><h3>3. Negociación</h3><p>Mantén flexibilidad pero conoce tu precio mínimo aceptable.</p><h3>4. Promesa de compraventa</h3><p>Documento que formaliza la intención de compra y establece condiciones.</p><h3>5. Escrituración</h3><p>Proceso final ante notario para transferir legalmente la propiedad.</p><h2>Impuestos y gastos</h2><p>Como vendedor, debes considerar:</p><ul><li>Impuesto de ganancias ocasionales (si aplica)</li><li>Gastos notariales (compartidos)</li><li>Comisiones inmobiliarias</li></ul><p>Nuestro equipo en Inmobiliaria Vergara te acompaña en cada paso del proceso de venta, garantizando transparencia y eficiencia.</p>',
                'meta_title' => 'Trámites para Vender Propiedad - Guía Completa Colombia',
                'meta_description' => 'Guía paso a paso sobre todos los trámites legales y administrativos necesarios para vender tu propiedad en Colombia.',
                'meta_keywords' => 'vender propiedad Colombia, trámites venta inmueble, documentos venta casa, proceso venta propiedad',
                'status' => 'published',
                'featured' => false,
                'published_at' => now()->subHours(6),
            ],
        ];

        foreach ($blogs as $blogData) {
            $blogData['user_id'] = $user->id;
            $blogData['slug'] = Str::slug($blogData['title']);
            
            Blog::create($blogData);
        }

        $this->command->info('Blog posts created successfully!');
    }
}
