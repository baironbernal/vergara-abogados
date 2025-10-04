import {MotionWrapper, BannerInformative, CardService} from "@/Components"
import { ServiceLawyersSection } from "@/Components/Services/ServiceLawyersSection"
import { useSeoManager } from "@/hooks/useSeoManager"

const Services = ({ services, lawyers, seo }) => {
    useSeoManager(seo)

  return (
    <>
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
            <MotionWrapper>
              <div className="grid grid-cols-1 gap-6 px-4 mx-auto max-w-7xl sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:px-8">
                {services && services.map((service, index) => (
                  <div key={service.id} className="h-full">
                    <CardService {...service} />
                  </div>
                ))}
              </div>
            </MotionWrapper>
      </section>

      {/* Team Section */}
      <ServiceLawyersSection lawyers={lawyers} />
    </>
  )
}

export default Services
