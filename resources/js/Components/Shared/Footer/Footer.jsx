import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight, Calendar } from "lucide-react";
import {MotionWrapper} from "@/Components";
import { Link } from "@inertiajs/react";

export const Footer = ({ latestBlogs = [] }) => {
  return (
    <MotionWrapper>
      <footer className="py-8 tracking-normal text-white bg-darki lg:py-12">
      <div className="px-4 mx-auto max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Column */}
          <div className="flex flex-col justify-between">
            <h3 className="mb-4 font-bold tracking-tight text-base font-prata lg:text-lg">About</h3>
            <p className="mb-4 text-sm leading-relaxed text-graykiSecondary">
            Somos una empresa líder dedicada a brindar servicios excepcionales y soluciones innovadoras a nuestros clientes en todo el mundo.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" />
              <Twitter className="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" />
              <Instagram className="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" />
              <Linkedin className="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" />
            </div>
          </div>

          {/* Latest Blog Posts */}
          <div>
            <h3 className="mb-4 font-bold tracking-tight text-base font-prata lg:text-lg">Últimos Artículos</h3>
            {latestBlogs.length > 0 ? (
              <ul className="space-y-2 md:space-y-3">
                {latestBlogs.map((blog) => (
                  <li key={blog.id}>
                    <Link 
                      href={`/blog/${blog.slug}`} 
                      className="group block"
                    >
                      <div className="flex items-start space-x-2 lg:space-x-3">
                        <ArrowRight className="w-3 h-3 mt-0.5 text-graykiSecondary group-hover:text-golden transition-colors flex-shrink-0 lg:w-4 lg:h-4" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs transition-colors text-graykiSecondary group-hover:text-white line-clamp-2 lg:text-sm">
                            {blog.title}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-400">
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
              <div className="text-xs text-graykiSecondary lg:text-sm">
                <p>No hay artículos disponibles.</p>
                <Link 
                  href="/blog" 
                  className="inline-flex items-center mt-2 text-xs transition-colors text-golden hover:text-white lg:text-sm"
                >
                  <ArrowRight className="w-3 h-3 mr-1 lg:w-4 lg:h-4" />
                  Ver blog
                </Link>
              </div>
            )}
            
            {latestBlogs.length > 0 && (
              <div className="mt-4">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center text-xs transition-colors text-golden hover:text-white lg:text-sm"
                >
                  <ArrowRight className="w-3 h-3 mr-1 lg:w-4 lg:h-4" />
                  Ver todos los artículos
                </Link>
              </div>
            )}
          </div>

          {/* Contact Info Column */}
          <div>
            <h3 className="mb-4 font-bold tracking-tight text-base font-prata lg:text-lg">Contact Info</h3>
            <article className="flex flex-col space-y-2 md:space-y-3">
              <div className="flex items-start space-x-2 lg:space-x-3">
                <MapPin className="w-4 h-4 text-graykiSecondary mt-0.5 flex-shrink-0" />
                <span className="text-xs text-graykiSecondary lg:text-sm">
                  Cl. 12 #8 05,
                  <br />
                  Soacha Cundinamarca
                </span>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-3">
                <Phone className="w-4 h-4 text-graykiSecondary flex-shrink-0" />
                <span className="text-xs text-graykiSecondary lg:text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-3">
                <Mail className="w-4 h-4 text-graykiSecondary flex-shrink-0" />
                <span className="text-xs text-graykiSecondary lg:text-sm">contact@company.com</span>
              </div>
            </article>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="mb-4 font-bold tracking-tight text-base font-prata lg:text-lg">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-xs transition-colors text-graykiSecondary hover:text-white lg:text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/acerca" className="text-xs transition-colors text-graykiSecondary hover:text-white lg:text-sm">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-xs transition-colors text-graykiSecondary hover:text-white lg:text-sm">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/inmobiliaria" className="text-xs transition-colors text-graykiSecondary hover:text-white lg:text-sm">
                  Propiedades
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-xs transition-colors text-graykiSecondary hover:text-white lg:text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-xs transition-colors text-graykiSecondary hover:text-white lg:text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-gray-700">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row">
            <p className="text-xs text-graykiSecondary lg:text-sm">
              © 2024 Inmobiliaria Vergara y Abogados. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 text-xs text-graykiSecondary lg:text-sm">
              <Link href="/privacy" className="hover:text-white">Política de Privacidad</Link>
              <Link href="/terms" className="hover:text-white">Términos de Servicio</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </MotionWrapper>
  );
};
