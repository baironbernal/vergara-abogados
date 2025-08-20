import { Link } from '@inertiajs/react';
import { useState } from 'react';
import MainButton from '../Buttons/MainButton';

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-10 h-10"
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

// SVG Icon for the close button (X
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


export const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/acerca', label: 'Nosotros' },
    { href: '/servicios', label: 'Servicios' },
    { href: '/inmobiliaria', label: 'Inmobiliaria' },
    { href: '/contacto', label: 'Contacto' },
  ];

  return (
    <div className="fixed z-10 w-full font-bold shadow-md bg-darki">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo or Site Title */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img src="/logo.webp" alt="Brand Vergara y Asociados" className="w-auto h-20 md:h-24" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="items-center hidden gap-8 font-semibold md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium transition-colors duration-300 text-softGrey hover:text-golden"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* Button to Reserve */}
          
          <MainButton as={Link} className={'py-3'} href="/contacto">
                Reserva tu consulta
            </MainButton>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
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
        <div className="bg-white border-t border-gray-200 md:hidden">
          <nav className="flex flex-col items-center py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-gray-600 transition-colors duration-300 hover:text-indigo-600"
                onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};


