<?php

namespace Database\Seeders;

use App\Models\Lawyer;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class LawyerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lawyers = [
            [
                'name'       => 'Bryan Vergara',
                'slug'       => 'bryan-vergara',
                'profession' => 'Abogado Corporativo',
                'title'      => 'Socio Fundador',
                'description' => 'Especialista en derecho corporativo y transacciones inmobiliarias con más de 15 años de experiencia.',
                'bio'        => '<p>Bryan Vergara es un destacado abogado especializado en derecho corporativo e inmobiliario. Con más de 15 años de experiencia, ha liderado exitosamente numerosas transacciones comerciales y ha asesorado a empresas en procesos de fusión y adquisición.</p><p>Su enfoque estratégico y atención al detalle lo han convertido en un referente en el sector inmobiliario de Cundinamarca.</p>',
                'phone'      => '+57 300-555-1234',
                'email'      => 'bryan.vergara@inmobiliariavergarayabogados.com',
                'image'      => null,
                'years_experience' => 15,
                'cases_won'  => 120,
                'office_location' => 'Cl. 12 #8 05, Suite 1400, Soacha, Cundinamarca',
                'office_hours' => 'Lunes a Viernes: 9:00 AM - 6:00 PM',
                'linkedin'   => null,
                'facebook'   => null,
                'twitter'    => null,
                'instagram'  => null,
                'education'  => [
                    [
                        'degree' => 'Derecho',
                        'institution' => 'Universidad Nacional de Colombia',
                        'year' => '2008',
                    ],
                    [
                        'degree' => 'Maestría en Derecho Corporativo',
                        'institution' => 'Universidad de los Andes',
                        'year' => '2012',
                    ],
                ],
                'experience' => [
                    [
                        'position' => 'Socio Fundador',
                        'company' => 'Inmobiliaria Vergara y Abogados',
                        'period' => '2015 - Presente',
                        'description' => 'Liderazgo de la firma y asesoría legal especializada en transacciones inmobiliarias.',
                    ],
                    [
                        'position' => 'Abogado Senior',
                        'company' => 'Firma Legal Asociados',
                        'period' => '2010 - 2015',
                        'description' => 'Asesoría en derecho corporativo y contratos comerciales.',
                    ],
                ],
                'specializations' => [
                    ['area' => 'Derecho Inmobiliario', 'percentage' => 90],
                    ['area' => 'Derecho Corporativo', 'percentage' => 85],
                    ['area' => 'Contratos Comerciales', 'percentage' => 80],
                ],
                'achievements' => [
                    [
                        'title' => 'Mejor Abogado Inmobiliario de Cundinamarca',
                        'year' => '2022',
                        'description' => 'Reconocimiento por excelencia en asesoría inmobiliaria.',
                    ],
                ],
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'name'       => 'Elvis Vergara',
                'slug'       => 'elvis-vergara',
                'profession' => 'Abogado Inmobiliario',
                'title'      => 'Socio',
                'description' => 'Experto en transacciones inmobiliarias y resolución de conflictos de propiedad.',
                'bio'        => '<p>Elvis Vergara cuenta con una sólida trayectoria en el sector inmobiliario. Su experiencia abarca desde asesoría en compraventa de propiedades hasta resolución de disputas territoriales.</p><p>Ha sido clave en el éxito de múltiples proyectos inmobiliarios en la región de Cundinamarca.</p>',
                'phone'      => '+57 300-555-5678',
                'email'      => 'elvis.vergara@inmobiliariavergarayabogados.com',
                'image'      => null,
                'years_experience' => 12,
                'cases_won'  => 95,
                'office_location' => 'Cl. 12 #8 05, Suite 1400, Soacha, Cundinamarca',
                'office_hours' => 'Lunes a Viernes: 9:00 AM - 6:00 PM',
                'linkedin'   => null,
                'facebook'   => null,
                'twitter'    => null,
                'instagram'  => null,
                'education'  => [
                    [
                        'degree' => 'Derecho',
                        'institution' => 'Universidad Libre de Colombia',
                        'year' => '2011',
                    ],
                ],
                'experience' => [
                    [
                        'position' => 'Socio',
                        'company' => 'Inmobiliaria Vergara y Abogados',
                        'period' => '2016 - Presente',
                        'description' => 'Asesoría especializada en transacciones inmobiliarias.',
                    ],
                ],
                'specializations' => [
                    ['area' => 'Derecho Inmobiliario', 'percentage' => 95],
                    ['area' => 'Resolución de Conflictos', 'percentage' => 75],
                ],
                'achievements' => [],
                'is_featured' => true,
                'order' => 2,
            ],
            [
                'name'       => 'Dayana Vergara',
                'slug'       => 'dayana-vergara',
                'profession' => 'Abogada Familiar',
                'title'      => 'Asociada Senior',
                'description' => 'Especialista en derecho de familia y sucesiones con enfoque en bienes inmuebles.',
                'bio'        => '<p>Ivon Vergara es una abogada comprometida con la defensa de los derechos familiares y la gestión de herencias y sucesiones.</p><p>Su experiencia en el manejo de propiedades heredadas la convierte en un pilar fundamental del equipo.</p>',
                'phone'      => '+57 300-555-9988',
                'email'      => 'dayana.vergara@inmobiliariavergarayabogados.com',
                'image'      => null,
                'years_experience' => 10,
                'cases_won'  => 78,
                'office_location' => 'Cl. 12 #8 05, Suite 1400, Soacha, Cundinamarca',
                'office_hours' => 'Lunes a Viernes: 9:00 AM - 6:00 PM',
                'linkedin'   => null,
                'facebook'   => null,
                'twitter'    => null,
                'instagram'  => null,
                'education'  => [
                    [
                        'degree' => 'Derecho',
                        'institution' => 'Universidad Santo Tomás',
                        'year' => '2013',
                    ],
                ],
                'experience' => [
                    [
                        'position' => 'Asociada Senior',
                        'company' => 'Inmobiliaria Vergara y Abogados',
                        'period' => '2018 - Presente',
                        'description' => 'Asesoría en derecho de familia y gestión de sucesiones.',
                    ],
                ],
                'specializations' => [
                    ['area' => 'Derecho de Familia', 'percentage' => 90],
                    ['area' => 'Sucesiones', 'percentage' => 85],
                    ['area' => 'Gestión de Herencias', 'percentage' => 80],
                ],
                'achievements' => [],
                'is_featured' => false,
                'order' => 3,
            ],
        ];

        foreach ($lawyers as $lawyerData) {
            // Create user account for the lawyer
            $user = User::create([
                'name' => $lawyerData['name'],
                'email' => $lawyerData['email'],
                'password' => Hash::make('password'),
            ]);

            // Assign lawyer role
            $user->assignRole('lawyer');

            // Create lawyer record linked to user
            $lawyerData['user_id'] = $user->id;
            Lawyer::create($lawyerData);
        }
    }
}
