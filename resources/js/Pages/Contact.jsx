import { useEffect } from "react"
import {MotionWrapper, MultiStep, SEOHead} from "@/Components"
import { Phone, MapPin, Mail, Clock } from "lucide-react"

const Contact = ({ citations , lawyers, seo}) => {

  // Hide info bar when entering contact page
  useEffect(() => {
    // Scroll to top to hide info bar
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <>
      <SEOHead seo={seo} />

      {/* Contact Section - Two Columns Layout */}
      <section className="w-full py-16 lg:py-24" style={{
            backgroundImage: "url('/images/shared/service-background.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}>
        <div className="px-4 mx-auto max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">

            {/* Left Column - Contact Form (2/3 of space) */}
            <div className="w-full lg:col-span-2">
              <MotionWrapper>
                <div className="mb-8 text-center">
                  <h1 className="mb-4 text-3xl font-bold text-darki font-prata lg:text-4xl">
                    Escribe tu Mensaje
                  </h1>
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-8 h-px bg-golden"></div>
                    <div className="mx-4 text-golden">//</div>
                    <div className="w-8 h-px bg-golden"></div>
                  </div>
                </div>

                {/* Contact Form */}
                <div id="contact-form">
                  <MultiStep citations={citations} lawyers={lawyers} />
                </div>
              </MotionWrapper>
            </div>

            {/* Right Column - Contact Information (1/3 of space) */}
            <div className="w-full lg:col-span-1">
              <MotionWrapper delay={0.2}>
                <div className="mb-8 text-center">
                  <h2 className="mb-4 text-3xl font-bold text-darki font-prata lg:text-4xl">
                    Ponte en Contacto con Nosotros
                  </h2>
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-8 h-px bg-golden"></div>
                    <div className="mx-4 text-golden">//</div>
                    <div className="w-8 h-px bg-golden"></div>
                  </div>
                </div>

                {/* Contact Info Cards */}
                <div className="space-y-6">
                  {/* Address */}
                  <MotionWrapper delay={0.1}>
                    <div className="flex items-start p-4 space-x-3 bg-white border border-softGrey">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-golden">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-bold text-darki font-prata">Dirección</h3>
                        <p className="text-sm text-greyki font-dmsans">
                          Cl. 12 #8 05,<br />
                          Soacha Cundinamarca,<br />
                          Colombia
                        </p>
                      </div>
                    </div>
                  </MotionWrapper>

                  {/* Phone & Email */}
                  <MotionWrapper delay={0.2}>
                    <div className="flex items-start p-4 space-x-3 bg-white border border-softGrey">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-golden">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-bold text-darki font-prata">Teléfono</h3>
                        <p className="mb-1 text-sm text-greyki font-dmsans">+1-258-987-000</p>
                        <p className="mb-1 text-sm text-greyki font-dmsans">+1-258-987-001</p>
                        <p className="text-sm text-greyki font-dmsans">admin@abogadosvergara.com</p>
                      </div>
                    </div>
                  </MotionWrapper>

                  {/* Office Hours */}
                  <MotionWrapper delay={0.3}>
                    <div className="flex items-start p-4 space-x-3 bg-white border border-softGrey">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-golden">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-bold text-darki font-prata">Horario de Atención</h3>
                        <div className="space-y-0.5 text-xs text-greyki font-dmsans">
                          <p><strong>Lunes:</strong> 09:00-17:00</p>
                          <p><strong>Martes:</strong> 09:00-17:00</p>
                          <p><strong>Miércoles:</strong> 09:00-17:00</p>
                          <p><strong>Jueves:</strong> 09:00-17:00</p>
                          <p><strong>Viernes:</strong> 09:00-17:00</p>
                          <p><strong>Sábado:</strong> 10:00-13:00</p>
                          <p><strong>Domingo:</strong> Cerrado</p>
                        </div>
                      </div>
                    </div>
                  </MotionWrapper>
                </div>

                {/* Additional Info Box */}
                <MotionWrapper delay={0.4}>
                  <div className="p-4 mt-6 border bg-softGrey/30 border-softGrey">
                    <h3 className="mb-3 text-lg font-bold text-center text-darki font-prata">
                      ¿Necesitas ayuda inmediata?
                    </h3>
                    <p className="mb-3 text-sm text-center text-greyki font-dmsans">
                      Nuestro equipo está disponible para responder tus consultas y brindarte la mejor asesoría legal.
                    </p>
                    <p className="text-xs text-center text-greyki font-dmsans">
                      <strong>Respuesta garantizada en menos de 24 horas</strong>
                    </p>
                  </div>
                </MotionWrapper>
              </MotionWrapper>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact
