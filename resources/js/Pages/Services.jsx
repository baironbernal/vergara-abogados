import {MotionWrapper, BannerInformative, CardService} from "@/Components"

const Services = ({ services }) => {
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

      
        <section className="relative w-full h-full" style={{ 
            backgroundImage: "url('/images/shared/service-background.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}>

            <div className="grid grid-cols-1 gap-8 mx-5 max-w-7xl md:mx-auto md:p-20 md:grid-cols-3 lg:grid-cols-3">
              {services && services.map((service) => (
                <CardService {...service} />
              ))}
            </div>
          </section>
      

       
    </>
  )
}


export default Services