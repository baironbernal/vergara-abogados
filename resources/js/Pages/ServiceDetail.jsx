import { useEffect } from "react";
import {
  Scale,
  Home,
  FileText,
  Users,
  Shield,
  Building,
  Gavel,
  Handshake,
  Briefcase,
  Landmark,
  FileCheck,
  UserCheck,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  Star,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { MotionWrapper, SEOHead, LawyerCard, MainButton, BannerInformative } from "@/Components";

// Array of icons to match the service cards
const serviceIcons = [
  Scale, Home, FileText, Users, Shield, Building, Gavel,
  Handshake, Briefcase, Landmark, FileCheck, UserCheck,
  DollarSign, MapPin, Phone, Mail, Calendar, Clock,
  CheckCircle, Star, Award, Target, Zap
];

// Function to get a consistent icon for a service based on its ID
const getServiceIcon = (serviceId) => {
  const iconIndex = serviceId % serviceIcons.length;
  return serviceIcons[iconIndex];
};

const ServiceDetail = ({ service, lawyers, seo }) => {
  const IconComponent = getServiceIcon(service.id);

  // Hide info bar when entering service detail page
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Function to handle contact button click
  const handleContactClick = (e) => {
    e.preventDefault();

    // Navigate to contact page
    window.location.href = '/contacto';
  };

  return (
    <>
      <SEOHead seo={seo} />

      {/* Banner Section */}
      <MotionWrapper>
        <BannerInformative
          picture="/images/shared/bg-services.webp"
          title={service.name}
          description={service.description || `Servicio especializado en ${service.category}`}
        />
      </MotionWrapper>

      {/* Service Details Section */}
      <section className="w-full py-16 lg:py-20 bg-white">
        <div className="px-4 mx-auto max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">

            {/* Left Column - Service Information */}
            <MotionWrapper>
              <div>
                <h2 className="mb-6 text-3xl font-bold text-darki font-prata lg:text-4xl">
                  Detalles del Servicio
                </h2>

                <div className="space-y-6">
                  {/* Service Type */}
                  <MotionWrapper delay={0.1}>
                    <div className="p-6 border border-softGrey">
                      <h3 className="mb-3 text-xl font-semibold text-darki font-prata">
                        Tipo de Servicio
                      </h3>
                      <p className="text-greyki font-dmsans">
                        {service.type || 'Servicio Legal Profesional'}
                      </p>
                    </div>
                  </MotionWrapper>

                  {/* Category Information */}
                  <MotionWrapper delay={0.2}>
                    <div className="p-6 border border-softGrey">
                      <h3 className="mb-3 text-xl font-semibold text-darki font-prata">
                        Área de Especialización
                      </h3>
                      <p className="text-greyki font-dmsans">
                        {service.category}
                        {service.subcategory && (
                          <span className="block mt-1 text-sm">
                            Subcategoría: {service.subcategory}
                          </span>
                        )}
                      </p>
                    </div>
                  </MotionWrapper>

                  {/* Service Benefits */}
                  <MotionWrapper delay={0.3}>
                    <div className="p-6 border border-softGrey">
                      <h3 className="mb-4 text-xl font-semibold text-darki font-prata">
                        Beneficios de Nuestro Servicio
                      </h3>
                      <ul className="space-y-2 text-greyki font-dmsans">
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 mr-3 text-golden" />
                          Asesoría legal especializada y personalizada
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 mr-3 text-golden" />
                          Acompañamiento durante todo el proceso
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 mr-3 text-golden" />
                          Experiencia y conocimiento del mercado local
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 mr-3 text-golden" />
                          Transparencia y comunicación constante
                        </li>
                      </ul>
                    </div>
                  </MotionWrapper>
                </div>
              </div>
            </MotionWrapper>

            {/* Right Column - Contact Form */}
            <MotionWrapper delay={0.2}>
              <div className="p-8 bg-softGrey/30 border border-softGrey">
                <h2 className="mb-6 text-3xl font-bold text-darki font-prata lg:text-4xl">
                  Solicita tu Consulta
                </h2>

                <p className="mb-6 text-greyki font-dmsans">
                  ¿Necesitas asesoría en {service.name.toLowerCase()}? Nuestro equipo de expertos está listo para ayudarte con tu caso específico.
                </p>

                <div className="space-y-4">
                  <MotionWrapper delay={0.1}>
                    <div className="flex items-center p-4 bg-white border border-softGrey">
                      <Phone className="w-6 h-6 mr-4 text-golden" />
                      <div>
                        <h4 className="font-semibold text-darki font-prata">Llámanos</h4>
                        <p className="text-sm text-greyki font-dmsans">+1-258-987-000</p>
                      </div>
                    </div>
                  </MotionWrapper>

                  <MotionWrapper delay={0.2}>
                    <div className="flex items-center p-4 bg-white border border-softGrey">
                      <Mail className="w-6 h-6 mr-4 text-golden" />
                      <div>
                        <h4 className="font-semibold text-darki font-prata">Escríbenos</h4>
                        <p className="text-sm text-greyki font-dmsans">admin@inmobiliariavergarayabogados.com</p>
                      </div>
                    </div>
                  </MotionWrapper>

                  <MotionWrapper delay={0.3}>
                    <div className="flex items-center p-4 bg-white border border-softGrey">
                      <Clock className="w-6 h-6 mr-4 text-golden" />
                      <div>
                        <h4 className="font-semibold text-darki font-prata">Horario</h4>
                        <p className="text-sm text-greyki font-dmsans">Lun - Vie: 9:00 - 17:00</p>
                      </div>
                    </div>
                  </MotionWrapper>
                </div>

                <MotionWrapper delay={0.4}>
                  <div className="mt-8">
                    <MainButton onClick={handleContactClick} className="w-full justify-center">
                      Solicitar Consulta
                    </MainButton>
                  </div>
                </MotionWrapper>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>


      {/* Team Section */}
      {lawyers && lawyers.length > 0 && (
        <section className="w-full py-16 lg:py-20 bg-white">
          <div className="px-4 mx-auto max-w-7xl lg:px-8">
            <MotionWrapper>
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-darki font-prata lg:text-4xl">
                  Nuestro Equipo Especializado
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-greyki font-dmsans lg:text-xl">
                  Conoce a nuestros abogados especialistas que pueden ayudarte con {service.name}
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
  );
};

export default ServiceDetail;
