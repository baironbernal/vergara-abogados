import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { MainButton } from "@/Components";
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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
    { href: '/', label: 'Inicio' },
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
            as={Link}
            href="/contacto"
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

      {/* Mobile Menu with animations */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
                duration: 0.4
              }}
              className="fixed top-0 right-0 z-50 w-full h-full max-w-sm bg-darki shadow-2xl lg:hidden"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-golden/20">
                <div className="flex items-center space-x-3">
                  <img src="/logo.webp" alt="Brand Vergara y Asociados" className="w-10 h-10" />
                  <span className="text-lg font-bold text-white font-prata">Menú</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-white transition-colors duration-300 hover:text-golden focus:outline-none"
                  aria-label="Close menu"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Menu Content */}
              <nav className="flex flex-col px-6 py-8 space-y-6">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                  >
                    <Link
                      href={link.href}
                      className="block text-xl font-medium text-white transition-all duration-300 hover:text-golden hover:translate-x-2 font-prata"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Contact Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: navLinks.length * 0.1 + 0.2,
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  className="pt-8 mt-8 border-t border-golden/20"
                >
                  <MainButton
                    as={Link}
                    href="/contacto"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full justify-center"
                  >
                    Reserva tu consulta
                  </MainButton>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};


