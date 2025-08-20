import BannerInformative from "@/Components/Shared/BannerInformative";
import MotionWrapper from "@/Components/Shared/Motion/MotionWrapper";
import { MultiStep } from "@/Components/Shared/Form/MultiStep";

const Contact = ({ citations , lawyers}) => {

  return (
    <>
      {/* BannerInformative component to display the title and description */}
      <MotionWrapper>
        <BannerInformative
        picture="/images/shared/background-title.webp"
        title="Contactanos"
        description="Agenda con nosotros una cita para recibir asesoría legal personalizada"
        /> 
      </MotionWrapper>

      {/* Contact Form */}
      <section className="flex w-full my-auto py-28 "  style={{ 
            backgroundImage: "url('/images/shared/service-background.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}>
         <div className="flex items-center justify-center max-w-4xl mx-auto gap-14 ">
           {/* MultiStep Form */}
           <MultiStep citations={citations} lawyers={lawyers} />

          {/* Information */}
          <section className="flex flex-col justify-start h-full gap-10 items-left">
            <article>
              <h2 className="text-2xl">Ubicacion</h2>
              <p>Miventore veritatis et quasi architecto beatae vitae dicta sunt
              nemo enim consequuntur magni dolores eos.</p>
            </article>

            <article>
              <h3>Direccion</h3>
              <p>15 Pills Avenue, Southern Street, Camron,
              Florida 33069 - USA</p>
            </article>

            <article>
              <h3>Telefonos</h3>
              <p>Appointments 1-258-987-000</p>
              <p>Appointments 1-258-987-000</p>
            </article>

            <article>
              <h3>Horarios </h3>
              <p>Mon to Fri : 09:00 am - 18:00 pm</p>
            </article>
          </section>
         </div>
      </section>
        
    </>
    
  )
}

export default Contact
