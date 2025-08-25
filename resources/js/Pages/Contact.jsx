import {MotionWrapper, BannerInformative, MultiStep} from "@/Components"

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
         <div className="items-center justify-center max-w-4xl mx-auto md:flex gap-14 ">
           {/* MultiStep Form */}
           <MultiStep citations={citations} lawyers={lawyers} />

          {/* Information */}
          <section className="flex flex-col justify-start h-full gap-10 items-left">
            <article>
              <h2 className="mb-2 text-xl font-bold tracking-tighter font-prata">Ubicacion</h2>
              <p className="text-sm">Miventore veritatis et quasi architecto beatae vitae dicta sunt
              nemo enim consequuntur magni dolores eos.</p>
            </article>

            <article>
              <h3 className="mb-2 text-xl font-bold tracking-tighter font-prata">Direccion</h3>
              <p className="text-sm">Cl. 12 #8 05, <br />
              Soacha Cundinamarca</p>
            </article>

            <article>
            <h2 className="mb-2 text-xl font-bold tracking-tighter font-prata">Telefonos</h2>
              <p className="text-sm">Oficina:  <b>1-258-987-000</b></p>
              <p className="text-sm">Personal:  <b>1-258-987-000</b></p>
            </article>

            <article>
            <h2 className="mb-2 text-xl font-bold tracking-tighter font-prata">Horarios</h2>
              <p className="text-sm">Mon to Fri : 09:00 am - 18:00 pm</p>
            </article>
          </section>
         </div>
      </section>
        
    </>
    
  )
}

export default Contact
