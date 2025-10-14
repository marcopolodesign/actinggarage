import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoMin from '../assets/LogoMin';
import { useFormFlyout } from '../context/FormFlyoutContext';
import { useAboutFlyout } from '../context/AboutFlyoutContext';

interface HeaderProps {
  showOnScroll?: boolean; // If true, only show after scrolling past viewport
}

const Header: React.FC<HeaderProps> = ({ showOnScroll = false }) => {
  const [isVisible, setIsVisible] = useState(!showOnScroll);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openFlyout } = useFormFlyout();
  const { openFlyout: openAboutFlyout } = useAboutFlyout();
  const location = useLocation();
  const isCursosPage = location.pathname === '/cursos';

  useEffect(() => {
    if (!showOnScroll) return;

    const handleScroll = () => {
      const scrolled = window.scrollY > window.innerHeight;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showOnScroll]);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    openFlyout();
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    openAboutFlyout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isVisible && showOnScroll) return null;

  return (
    <>
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ backgroundColor: isCursosPage ? 'transparent' : '#000000' }}
      >
        <div className="flex items-center justify-between px-8 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center w-40">
            <LogoMin />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/"
              className="text-white text-sm uppercase font-semibold hover:text-tag-yellow transition-colors duration-300"
            >
              Inicio
            </Link>
            <button
              onClick={handleAboutClick}
              className="text-white text-sm uppercase font-semibold hover:text-tag-yellow transition-colors duration-300"
            >
              About
            </button>
            <Link 
              to="/cursos"
              className="text-white text-sm uppercase font-semibold hover:text-tag-yellow transition-colors duration-300"
            >
              Cursos
            </Link>
            <button
              onClick={handleContactClick}
              className="text-white text-sm uppercase font-semibold hover:text-tag-yellow transition-colors duration-300"
            >
              Contacto
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
            aria-label="Toggle menu"
          >
            <span 
              className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span 
              className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            ></span>
            <span 
              className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            ></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-tag-yellow transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col items-center justify-center min-h-screen space-y-12">
          <Link 
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-black text-4xl uppercase font-druk hover:opacity-70 transition-opacity duration-300"
          >
            Inicio
          </Link>
          <button
            onClick={handleAboutClick}
            className="text-black text-4xl uppercase font-druk hover:opacity-70 transition-opacity duration-300"
          >
            About
          </button>
          <Link 
            to="/cursos"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-black text-4xl uppercase font-druk hover:opacity-70 transition-opacity duration-300"
          >
            Cursos
          </Link>
          <button
            onClick={handleContactClick}
            className="text-black text-4xl uppercase font-druk hover:opacity-70 transition-opacity duration-300"
          >
            Contacto
          </button>
        </nav>
      </div>
    </>
  );
};

export default Header;
