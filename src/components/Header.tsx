import React, { useState, useEffect, useMemo } from 'react';
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

  // Determine WhatsApp message based on UTM parameters
  const whatsappMessage = useMemo(() => {
    const urlParams = new URLSearchParams(location.search);
    const utm_source = urlParams.get('utm_source');
    const utm_medium = urlParams.get('utm_medium');
    const utm_campaign = urlParams.get('utm_campaign');
    
    // If any UTM parameters are present, it's a paid campaign
    const hasUtmParams = utm_source || utm_medium || utm_campaign;
    
    if (hasUtmParams) {
      // Paid message
      return encodeURIComponent("Hola TAG! Quiero más info sobre sus cursos!");
    } else {
      // Organic message
      return encodeURIComponent("Hola! Quiero más información sobre los cursos de la escuela");
    }
  }, [location.search]);

  const whatsappUrl = `https://wa.me/34682560187?text=${whatsappMessage}`;

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

  // Navigation items - shared for desktop and mobile
  const navItems = [
    { 
      label: 'Inicio', 
      to: '/', 
      type: 'link' as const,
      onClick: () => setIsMobileMenuOpen(false)
    },
    { 
      label: 'About', 
      type: 'button' as const,
      onClick: handleAboutClick
    },
    { 
      label: 'Cursos', 
      to: '/cursos', 
      type: 'link' as const,
      onClick: () => setIsMobileMenuOpen(false)
    },
    { 
      label: 'Contacto', 
      type: 'button' as const,
      onClick: handleContactClick
    }
  ];

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
          <nav className="hidden md:flex items-center space-x-8 desktop-nav">
            {navItems.map((item, index) => {
              const desktopClassName = "text-white text-sm uppercase hover:text-tag-yellow transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-white after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-[.45s] after:ease-[cubic-bezier(0.4,0,0,1)] after:translate-y-1";
              const desktopStyle = { WebkitFontSmoothing: 'antialiased' as const };
              
              if (item.type === 'link' && item.to) {
                return (
                  <Link 
                    key={index}
                    to={item.to}
                    onClick={item.onClick}
                    className={desktopClassName}
                    style={desktopStyle}
                  >
                    {item.label}
                  </Link>
                );
              }
              
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={desktopClassName}
                  style={desktopStyle}
                >
                  {item.label}
                </button>
              );
            })}
            
            {/* WhatsApp Button */}
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white text-sm uppercase hover:text-tag-yellow transition-colors duration-300"
              style={{ WebkitFontSmoothing: 'antialiased' as const }}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none"
                className="transition-colors duration-300"
              >
                <path 
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                  fill="currentColor"
                />
              </svg>
              <span>WhatsApp</span>
            </a>
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
          {navItems.map((item, index) => {
            const mobileClassName = "text-black text-4xl uppercase font-druk hover:opacity-70 transition-opacity duration-300 cursor-pointer relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-white after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-[.45s] after:ease-[cubic-bezier(0.4,0,0,1)] after:translate-y-1";
            
            if (item.type === 'link' && item.to) {
              return (
                <Link 
                  key={index}
                  to={item.to}
                  onClick={item.onClick}
                  className={mobileClassName}
                >
                  {item.label}
                </Link>
              );
            }
            
            return (
              <button
                key={index}
                onClick={item.onClick}
                className={mobileClassName}
              >
                {item.label}
              </button>
            );
          })}
          
          {/* WhatsApp Button for Mobile */}
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-black text-4xl uppercase font-druk hover:opacity-70 transition-opacity duration-300"
          >
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <path 
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                fill="currentColor"
              />
            </svg>
            <span>WhatsApp</span>
          </a>
        </nav>
      </div>
    </>
  );
};

export default Header;
