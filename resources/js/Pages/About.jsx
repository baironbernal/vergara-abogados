import BannerInformative from "@/Components/Shared/BannerInformative"
import MotionWrapper from "@/Components/Shared/Motion/MotionWrapper"

const About = () => {
  return (
    <>
      <MotionWrapper>
        <BannerInformative 
          picture="/images/shared/background-title.webp"
          title="Nosotros"
          description="Conoce más sobre nuestra historia, misión y visión"
        />
      </MotionWrapper>


      <div className="min-h-screen ">
      {/* Header Section */}

      {/* Main Content */}
      <main className="max-w-6xl px-6 py-16 mx-auto">
        {/* Mission Section */}
        <MotionWrapper>
        <section className="mb-16">
          <div className="bg-white border-0 shadow-lg">
            <div className="p-8 md:p-12">
              <div className="flex items-center mb-8">
                <div className="w-1 h-12 bg-[#C59B40] mr-6"></div>
                <h2 className="text-3xl font-bold font-prata md:text-4xl">Misión</h2>
              </div>
              <div className="space-y-6 leading-relaxed prose prose-lg max-w-none">
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
        <section className="mb-16">
          <div className="bg-white border-0 shadow-lg">
            <div className="p-8 md:p-12">
              <div className="flex items-center mb-8">
                <div className="w-1 h-12 bg-[#C59B40] mr-6"></div>
                <h2 className="text-3xl font-bold font-prata md:text-4xl">Vision</h2>
              </div>
              <div className="space-y-6 leading-relaxed prose prose-lg max-w-none">
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
        <section className="mb-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold font-prata md:text-4xl">Nuestros Valores</h2>
            <div className="w-24 h-1 bg-[#C59B40] mx-auto"></div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="transition-shadow bg-white border-0 shadow-lg hover:shadow-xl">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-[#C59B40] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-xl font-bold">Confianza</h3>
                <p className="leading-relaxed">
                  Construimos relaciones sólidas basadas en la transparencia y la honestidad en cada transacción.
                </p>
              </div>
            </div>

            <div className="transition-shadow bg-white border-0 shadow-lg hover:shadow-xl">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-[#C59B40] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-xl font-bold">Excelencia</h3>
                <p className="leading-relaxed">
                  Nos comprometemos con la calidad superior en todos nuestros servicios y procesos.
                </p>
              </div>
            </div>

            <div className="transition-shadow bg-white border-0 shadow-lg hover:shadow-xl">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-[#C59B40] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-xl font-bold">Compromiso</h3>
                <p className="leading-relaxed">
                  Dedicación total hacia el éxito de nuestros clientes y el crecimiento mutuo.
                </p>
              </div>
            </div>
          </div>
        </section>
        </MotionWrapper>

        {/* CTA Section */}
        <section className="w-full p-12 text-center text-white bg-blueki">
          <h2 className="mb-4 font-serif text-3xl font-bold">¿Listo para comenzar su próximo proyecto inmobiliario?</h2>
          <p className="text-xl text-[#CBCFD5] mb-8 max-w-2xl mx-auto">
            Contáctenos hoy y descubra cómo podemos ser su aliado estratégico en el mundo inmobiliario.
          </p>
          <button className="bg-[#C59B40] hover:bg-[#B8893A] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
            Contactar Ahora
          </button>
        </section>
      </main>
    </div>
    </>
  )
}

export default About


