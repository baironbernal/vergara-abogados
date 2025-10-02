import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight, Calendar } from "lucide-react";
import {MotionWrapper} from "@/Components";
import { Link } from "@inertiajs/react";

export const Footer = ({ latestBlogs = [], corporativeInfo = null }) => {
  // Extract corporative info with fallbacks
  const facebook = corporativeInfo?.corporative_facebook;
  const twitter = corporativeInfo?.corporative_twitter;
  const instagram = corporativeInfo?.corporative_instagram;
  const linkedin = corporativeInfo?.corporative_linkedin;
  const email = corporativeInfo?.corporative_email || 'contact@company.com';
  const phone = corporativeInfo?.corporative_whatsapp || '+1 (555) 123-4567';
  const address = corporativeInfo?.office_address || 'Cl. 12 #8 05,\nSoacha Cundinamarca';
  const copyright = corporativeInfo?.copyright_text || '© 2024 Inmobiliaria Vergara y Abogados. Todos los derechos reservados.';

  return (
    <MotionWrapper>
      <footer className="py-8 tracking-normal text-white bg-darki lg:py-12">
      <div className="px-4 mx-auto max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Column */}
          <div className="flex flex-col justify-start text-left">
            <h3 className="mb-4 text-base font-bold tracking-tight text-left font-prata lg:text-lg">Acerca de</h3>
            <p className="mb-4 text-sm leading-relaxed text-left text-graykiSecondary">
            Somos una empresa líder dedicada a brindar servicios excepcionales y soluciones innovadoras a nuestros clientes en todo el mundo.
            </p>
            <div className="flex justify-start space-x-4">
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" />
                </a>
              )}
              {twitter && (
                <a href={twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" />
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" />
                </a>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" />
                </a>
              )}
            </div>
          </div>

          {/* Latest Blog Posts */}
          <div className="text-left">
            <h3 className="mb-4 text-base font-bold tracking-tight text-left font-prata lg:text-lg">Últimos Artículos</h3>
            {latestBlogs.length > 0 ? (
              <ul className="space-y-2 text-left md:space-y-3">
                {latestBlogs.map((blog) => (
                  <li key={blog.id} className="text-left">
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="block text-left group"
                    >
                      <div className="flex items-start justify-start space-x-2 lg:space-x-3">
                        <ArrowRight className="w-3 h-3 mt-0.5 text-graykiSecondary group-hover:text-golden transition-colors flex-shrink-0 lg:w-4 lg:h-4" />
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-xs text-left transition-colors text-graykiSecondary group-hover:text-white line-clamp-2 lg:text-sm">
                            {blog.title}
                          </p>
                          <div className="flex items-center justify-start mt-1 text-xs text-gray-400">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(blog.published_at).toLocaleDateString('es-CO', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-left text-graykiSecondary lg:text-sm">
                <p className="text-left">No hay artículos disponibles.</p>
                <Link
                  href="/blog"
                  className="inline-flex items-center mt-2 text-xs text-left transition-colors text-golden hover:text-white lg:text-sm"
                >
                  <ArrowRight className="w-3 h-3 mr-1 lg:w-4 lg:h-4" />
                  Ver blog
                </Link>
              </div>
            )}

            {latestBlogs.length > 0 && (
              <div className="mt-4 text-left">
                <Link
                  href="/blog"
                  className="inline-flex items-center text-xs text-left transition-colors text-golden hover:text-white lg:text-sm"
                >
                  <ArrowRight className="w-3 h-3 mr-1 lg:w-4 lg:h-4" />
                  Ver todos los artículos
                </Link>
              </div>
            )}
          </div>

          {/* Contact Info Column */}
          <div className="text-left">
            <h3 className="mb-4 text-base font-bold tracking-tight text-left font-prata lg:text-lg">Información de Contacto</h3>
            <article className="flex flex-col space-y-2 text-left md:space-y-3">
              <div className="flex items-start justify-start space-x-2 lg:space-x-3">
                <MapPin className="w-4 h-4 text-graykiSecondary mt-0.5 flex-shrink-0" />
                <span className="text-xs text-left text-graykiSecondary lg:text-sm whitespace-pre-line">
                  {address}
                </span>
              </div>
              <div className="flex items-center justify-start space-x-2 lg:space-x-3">
                <Phone className="flex-shrink-0 w-4 h-4 text-graykiSecondary" />
                <span className="text-xs text-left text-graykiSecondary lg:text-sm">{phone}</span>
              </div>
              <div className="flex items-center justify-start space-x-2 lg:space-x-3">
                <Mail className="flex-shrink-0 w-4 h-4 text-graykiSecondary" />
                <span className="text-xs text-left text-graykiSecondary lg:text-sm">{email}</span>
              </div>
            </article>
          </div>

          {/* Quick Links Column */}
          <div className="text-left">
            <h3 className="mb-4 text-base font-bold tracking-tight text-left font-prata lg:text-lg">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-left">
              <li className="text-left">
                <Link href="/" className="text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm">
                  Inicio
                </Link>
              </li>
              <li className="text-left">
                <Link href="/acerca" className="text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm">
                  Nosotros
                </Link>
              </li>
              <li className="text-left">
                <Link href="/servicios" className="text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm">
                  Servicios
                </Link>
              </li>
              <li className="text-left">
                <Link href="/inmobiliaria" className="text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm">
                  Propiedades
                </Link>
              </li>
              <li className="text-left">
                <Link href="/blog" className="text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm">
                  Blog
                </Link>
              </li>
              <li className="text-left">
                <Link href="/contacto" className="text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-gray-700">
          <div className="flex flex-col items-start justify-between gap-4 text-left md:flex-row">
            <p className="text-xs text-left text-graykiSecondary lg:text-sm">
              {copyright}
            </p>
            <div className="flex space-x-4 text-xs text-left text-graykiSecondary lg:text-sm">
              <Link href="/privacy" className="text-left hover:text-white">Política de Privacidad</Link>
              <Link href="/terms" className="text-left hover:text-white">Términos de Servicio</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </MotionWrapper>
  );
};
