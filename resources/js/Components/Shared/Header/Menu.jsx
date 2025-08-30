import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { MainButton } from "@/Components";
import clsx from 'clsx';

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8 lg:w-10 lg:h-10"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16m-7 6h7"
    />
  </svg>
);

// SVG Icon for the close button (X)
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);


export const Menu = ({ styles }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to handle contact button click
  const handleContactClick = (e) => {
    e.preventDefault();

    // Hide the info bar by scrolling up slightly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Wait a bit then scroll to contact form
    setTimeout(() => {
      const contactForm = document.getElementById('contact-form');
      if (contactForm) {
        contactForm.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 300);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/acerca', label: 'Nosotros' },
    { href: '/servicios', label: 'Servicios' },
    { href: '/inmobiliaria', label: 'Inmobiliaria' },
    { href: '/blog', label: 'Blog' },
    { href: '/contacto', label: 'Contacto' },
  ];

  return (
    <div className={clsx("fixed z-10 w-full font-bold shadow-md", styles)}>
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo or Site Title */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img src="/logo.webp" alt="Brand Vergara y Asociados" className="w-auto h-16 md:h-20 lg:h-24" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="items-center hidden gap-6 font-semibold lg:flex xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium transition-colors duration-300 hover:text-golden"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* Button to Reserve */}

          <MainButton
            onClick={handleContactClick}
            className={'py-2 hidden lg:block lg:py-3'}
          >
            Reserva tu consulta
          </MainButton>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-greyki hover:text-golden focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (conditionally rendered) */}
      {isMenuOpen && (
        <div className="bg-white border-t border-gray-200 lg:hidden">
          <nav className="flex flex-col items-center py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-gray-600 transition-colors duration-300 hover:text-golden"
                onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <MainButton onClick={(e) => {
                setIsMenuOpen(false);
                handleContactClick(e);
              }}>
                Reserva tu consulta
              </MainButton>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};


