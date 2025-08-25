import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from "lucide-react";
import {MotionWrapper} from "@/Components";

export const Footer = () => {
  return (
    <MotionWrapper>
      <footer className="py-12 tracking-normal text-white bg-darki ">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Column */}
          <div className="flex flex-col justify-between">
            <h3 className="mb-4 font-bold tracking-tight md:text-lg font-prata">About</h3>
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

          {/* Recent News Column */}
          <div>
            <h3 className="mb-4 font-bold tracking-tight md:text-lg font-prata">Recent News</h3>
            <ul className="space-y-1 md:space-y-3">
              <li>
                <a href="#" className="flex items-center text-sm transition-colors text-graykiSecondary justify-left hover:text-white">
                  <ArrowRight className="w-4 mr-1" />
                   Company Launches New Product Line
                </a>
              </li>
              <li>
                 <a href="#" className="flex items-center text-sm transition-colors text-graykiSecondary justify-left hover:text-white">
                  <ArrowRight className="w-4 mr-1" />
                  Partnership with Global Tech Leader
                </a>
              </li>
              <li>
                 <a href="#" className="flex items-center text-sm transition-colors text-graykiSecondary justify-left hover:text-white">
                  <ArrowRight className="w-4 mr-1" />
                  Award for Innovation Excellence
                </a>
              </li>
              <li>
                 <a href="#" className="flex items-center text-sm transition-colors text-graykiSecondary justify-left hover:text-white">
                  <ArrowRight className="w-4 mr-1" />
                  Expansion to New Markets
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div>
            <h3 className="mb-4 font-bold tracking-tight md:text-lg font-prata">Contact Info</h3>
            <article className="flex flex-col space-y-1 md:space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-graykiSecondary" />
                <span className="text-sm text-graykiSecondary">
                  Cl. 12 #8 05,
                  <br />
                  Soacha Cundinamarca
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-graykiSecondary" />
                <span className="text-sm text-graykiSecondary">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-graykiSecondary" />
                <span className="text-sm text-graykiSecondary">contact@company.com</span>
              </div>
            </article>
          </div>

          {/* Business Overview Column */}
          <div>
            <h3 className="mb-4 font-bold tracking-tight md:text-lg font-prata">Business Overview</h3>
            <ul className="space-y-1 md:space-y-3">
              <li>
                 <a href="#" className="flex items-center text-sm transition-colors text-graykiSecondary justify-left hover:text-white">
                  <ArrowRight className="w-4 mr-1" />
                  Our Services
                </a>
              </li>
              <li>
                 <a href="#" className="flex items-center text-sm transition-colors text-graykiSecondary justify-left hover:text-white">
                  <ArrowRight className="w-4 mr-1" />
                  Case Studies
                </a>
              </li>
              <li>
                 <a href="#" className="flex items-center text-sm transition-colors text-graykiSecondary justify-left hover:text-white">
                  <ArrowRight className="w-4 mr-1" />
                  Client Testimonials
                </a>
              </li>
              <li>
                 <a href="#" className="flex items-center text-sm transition-colors text-graykiSecondary justify-left hover:text-white">
                  <ArrowRight className="w-4 mr-1" />
                  Career Opportunities
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="pt-6 mt-8 text-center border-t border-gray-800">
          <p className="text-sm text-gray-400">© 2025 Vergara Abogados. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
    </MotionWrapper>
  );
};
