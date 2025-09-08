import {MotionWrapper, BannerInformative, MainButton, SEOHead} from "@/Components"
import { Link } from "@inertiajs/react"

const About = ({ seo, lawyers }) => {
  return (
    <>
      <SEOHead seo={seo} />
      <MotionWrapper>
        <BannerInformative
          picture="/images/shared/background-title.webp"
          title="Nosotros"
          description="Conoce más sobre nuestra historia, misión y visión"
        />
      </MotionWrapper>


      <div className="min-h-screen">
      {/* Header Section */}

      {/* Main Content */}
      <main className="max-w-6xl px-4 py-12 mx-auto lg:px-6 lg:py-16">
        {/* Mission Section */}
        <MotionWrapper>
        <section className="mb-12 lg:mb-16">
          <div className="bg-white border-0 shadow-lg">
            <div className="p-6 md:p-8 lg:p-12">
              <div className="flex items-center mb-6 lg:mb-8">
                <div className="w-1 h-8 bg-[#C59B40] mr-4 lg:h-12 lg:mr-6"></div>
                <h2 className="text-2xl font-bold font-prata md:text-3xl lg:text-4xl">Misión</h2>
              </div>
              <div className="space-y-4 leading-relaxed prose prose-lg max-w-none lg:space-y-6">
                <p>
                  En Inmobiliaria Vergara y Abogados, nos enorgullece ser el aliado estratégico de nuestros clientes en
                  la compra y venta de inmuebles, brindando asesoría legal especializada, garantizando transacciones
                  seguras y confiables a través de un equipo de profesionales altamente capacitados. Combinamos la
                  experiencia inmobiliaria con el respaldo jurídico, ofreciendo un servicio personalizado que se adapta
                  a las necesidades específicas de cada cliente.
                </p>
                <p>
                  Actuamos con ética, responsabilidad y compromiso en cada paso, fortaleciendo la seguridad jurídica en
                  cada proceso y contribuyendo al desarrollo patrimonial de quienes confían en nosotros. En nuestra
                  empresa, trabajamos para que cada decisión, grande o pequeña, sea respaldada por confianza y
                  seguridad.
                </p>
              </div>
            </div>
          </div>
        </section>
        </MotionWrapper>

        {/* Vision Section */}
        <MotionWrapper>
        <section className="mb-12 lg:mb-16">
          <div className="bg-white border-0 shadow-lg">
            <div className="p-6 md:p-8 lg:p-12">
              <div className="flex items-center mb-6 lg:mb-8">
                <div className="w-1 h-8 bg-[#C59B40] mr-4 lg:h-12 lg:mr-6"></div>
                <h2 className="text-2xl font-bold font-prata md:text-3xl lg:text-4xl">Vision</h2>
              </div>
              <div className="space-y-4 leading-relaxed prose prose-lg max-w-none lg:space-y-6">
                <p>
                  Ser una empresa líder y referente en el sector inmobiliario y jurídico, destacada por la calidad de
                  nuestros servicios, la transparencia en nuestras operaciones y el firme compromiso con nuestros
                  clientes. Aspiramos a expandir nuestra presencia en todo el territorio nacional y consolidarnos como
                  una firma innovadora que combine la experiencia en bienes raíces con el respaldo legal, ofreciendo
                  soluciones efectivas, seguras y adaptadas a las necesidades de cada cliente.
                </p>
                <p>
                  Nos proyectamos como un equipo en constante evolución, que se adapta al dinamismo del mercado,
                  integrando nuevas tecnologías para mejorar la experiencia de quienes buscan asesoría inmobiliaria y
                  jurídica de confianza. Nuestro objetivo es seguir creciendo y ser siempre un aliado confiable y
                  especializado para nuestros clientes.
                </p>
              </div>
            </div>
          </div>
        </section>
        </MotionWrapper>

        {/* Values Section */}
        <MotionWrapper>
        <section className="mb-12 lg:mb-16">
          <div className="mb-8 text-center lg:mb-12">
            <h2 className="mb-4 text-2xl font-bold font-prata md:text-3xl lg:text-4xl">Nuestros Valores</h2>
            <div className="w-16 h-1 bg-[#C59B40] mx-auto lg:w-24"></div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            <div className="transition-shadow bg-white border-0 shadow-lg hover:shadow-xl">
              <div className="p-6 text-center lg:p-8">
                <div className="w-12 h-12 bg-[#C59B40] rounded-full flex items-center justify-center mx-auto mb-4 lg:w-16 lg:h-16 lg:mb-6">
                  <svg className="w-6 h-6 text-white lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-lg font-bold lg:text-xl">Confianza</h3>
                <p className="text-sm text-gray-600 lg:text-base">
                  Construimos relaciones duraderas basadas en la confianza mutua, la transparencia y el compromiso con nuestros clientes.
                </p>
              </div>
            </div>

            <div className="transition-shadow bg-white border-0 shadow-lg hover:shadow-xl">
              <div className="p-6 text-center lg:p-8">
                <div className="w-12 h-12 bg-[#C59B40] rounded-full flex items-center justify-center mx-auto mb-4 lg:w-16 lg:h-16 lg:mb-6">
                  <svg className="w-6 h-6 text-white lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-lg font-bold lg:text-xl">Excelencia</h3>
                <p className="text-sm text-gray-600 lg:text-base">
                  Buscamos la excelencia en cada servicio que ofrecemos, manteniendo los más altos estándares de calidad y profesionalismo.
                </p>
              </div>
            </div>

            <div className="transition-shadow bg-white border-0 shadow-lg hover:shadow-xl md:col-span-2 lg:col-span-1">
              <div className="p-6 text-center lg:p-8">
                <div className="w-12 h-12 bg-[#C59B40] rounded-full flex items-center justify-center mx-auto mb-4 lg:w-16 lg:h-16 lg:mb-6">
                  <svg className="w-6 h-6 text-white lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-lg font-bold lg:text-xl">Integridad</h3>
                <p className="text-sm text-gray-600 lg:text-base">
                  Actuamos con honestidad, ética y responsabilidad en todas nuestras operaciones y relaciones comerciales.
                </p>
              </div>
            </div>
          </div>
        </section>
        </MotionWrapper>

        {/* Team Section */}
        <MotionWrapper>
        <section className="mb-12 lg:mb-16">
          <div className="mb-8 text-center lg:mb-12">
            <h2 className="mb-4 text-2xl font-bold font-prata md:text-3xl lg:text-4xl">Nuestro Equipo</h2>
            <div className="w-16 h-1 bg-[#C59B40] mx-auto lg:w-24"></div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {lawyers && lawyers.length > 0 ? (
              lawyers.map((lawyer) => (
                <div key={lawyer.id} className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 lg:w-32 lg:h-32 lg:mb-6 rounded-full overflow-hidden">
                    {lawyer.image ? (
                      <img 
                        src={lawyer.image} 
                        alt={lawyer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-full"></div>
                    )}
                  </div>
                  <h3 className="mb-2 text-lg font-bold lg:text-xl">{lawyer.name}</h3>
                  <p className="text-sm text-gray-600 lg:text-base">{lawyer.description}</p>
                </div>
              ))
            ) : (
              // Fallback content if no lawyers data
              <>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 lg:w-32 lg:h-32 lg:mb-6"></div>
                  <h3 className="mb-2 text-lg font-bold lg:text-xl">Juan Vergara</h3>
                  <p className="text-sm text-gray-600 lg:text-base">Director General</p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 lg:w-32 lg:h-32 lg:mb-6"></div>
                  <h3 className="mb-2 text-lg font-bold lg:text-xl">María González</h3>
                  <p className="text-sm text-gray-600 lg:text-base">Asesora Legal</p>
                </div>

                <div className="text-center md:col-span-2 lg:col-span-1">
                  <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 lg:w-32 lg:h-32 lg:mb-6"></div>
                  <h3 className="mb-2 text-lg font-bold lg:text-xl">Carlos Rodríguez</h3>
                  <p className="text-sm text-gray-600 lg:text-base">Asesor Inmobiliario</p>
                </div>
              </>
            )}
          </div>
        </section>
        </MotionWrapper>

        {/* CTA Section */}
        <MotionWrapper>
        <section className="text-center">
          <div className="p-8 bg-[#C59B40] rounded-lg lg:p-12">
            <h2 className="mb-4 text-2xl font-bold text-white font-prata md:text-3xl lg:text-4xl">
              ¿Listo para trabajar con nosotros?
            </h2>
            <p className="mb-6 text-white lg:mb-8 lg:text-lg">
              Contáctanos hoy mismo para recibir la mejor asesoría inmobiliaria y legal.
            </p>
            <MainButton as={Link} href="/contacto" className="bg-white text-[#C59B40] hover:bg-gray-100">
              Contactar Ahora
            </MainButton>
          </div>
        </section>
        </MotionWrapper>
      </main>
      </div>
    </>
  )
}

export default About


