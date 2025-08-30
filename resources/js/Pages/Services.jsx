import {MotionWrapper, BannerInformative, CardService, SEOHead, LawyerCard} from "@/Components"

const Services = ({ services, lawyers, seo }) => {
  return (
    <>
    <SEOHead seo={seo} />
    {/* Banner for Service*/}
      <MotionWrapper>
        <BannerInformative
          picture="/images/shared/bg-services.webp"
          title="Servicios"
          description="Descubre los servicios legales que ofrecemos para proteger tus derechos y resolver tus problemas"
          />
      </MotionWrapper>

      {/* Services Section */}
      <section className="relative w-full py-12 lg:py-20" style={{
            backgroundImage: "url('/images/shared/service-background.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}>

            <div className="grid grid-cols-1 gap-6 px-4 mx-auto max-w-7xl sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:px-8">
              {services && services.map((service) => (
                <CardService key={service.id} {...service} />
              ))}
            </div>
      </section>

      {/* Team Section */}
      {lawyers && lawyers.length > 0 && (
        <section className="py-12 bg-whiteki lg:py-20">
          <div className="px-4 mx-auto max-w-7xl lg:px-8">
            <MotionWrapper>
              <div className="mb-12 text-center lg:mb-16">
                <h2 className="mb-4 text-3xl font-bold text-darki font-prata lg:text-4xl">
                  Nuestro Equipo
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-greyki font-dmsans lg:text-xl">
                  Conoce a nuestros abogados especialistas en derecho inmobiliario
                </p>
                <div className="w-16 h-1 mx-auto mt-6 bg-golden lg:w-24"></div>
              </div>
            </MotionWrapper>

            <div className="grid grid-cols-1 gap-8 mx-auto max-w-6xl md:grid-cols-2 lg:grid-cols-3">
              {lawyers.map((lawyer) => (
                <MotionWrapper key={lawyer.id}>
                  <LawyerCard lawyer={lawyer} />
                </MotionWrapper>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default Services
