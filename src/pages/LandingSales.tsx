import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';

const LandingSales: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showFixedButton, setShowFixedButton] = useState(false);
  const inlineButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer for inline button visibility
  useEffect(() => {
    if (!isMobile || !inlineButtonRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFixedButton(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-100px' }
    );

    observer.observe(inlineButtonRef.current);

    return () => {
      if (inlineButtonRef.current) {
        observer.unobserve(inlineButtonRef.current);
      }
    };
  }, [isMobile]);

  const handleCTAClick = () => {
    const message = encodeURIComponent('Hola! Quiero más información sobre los cursos trimestrales y semestrales');
    window.open(`https://wa.me/34682560187?text=${message}`, '_blank');
  };

  return (
    <section className="bg-black min-h-screen">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Cursos Trimestrales y Semestrales - Enero 2025 | TAG</title>
        <meta name="title" content="Cursos Trimestrales y Semestrales - Enero 2025 | TAG" />
        <meta name="description" content="Inscríbete a nuestros cursos trimestrales y semestrales que inician en enero. Transforma tu carrera con TAG." />
      </Helmet>

      {/* Header */}
      <Header showOnScroll={false} />

      {/* Main Content Container - Single Column */}
      <div className="w-full px-6 sm:px-12 lg:px-24 pt-24 sm:pt-32 pb-8 bg-black">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-druk text-tag-yellow leading-tight mb-4">
            Cursos Trimestrales y Semestrales
          </h1>

          <p className="text-lg sm:text-xl text-white mb-8 font-garamond max-w-2xl mx-auto">
            Inicia enero con nuestra nueva oferta de cursos trimestrales y semestrales. Aprende a tu ritmo y transforma tu carrera profesional con metodologías probadas y contenido de alto valor.
          </p>

          {/* Video Container */}
          <div className="w-full mb-8" style={{ padding: "56.25% 0 0 0", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
              <iframe
                src="https://www.youtube.com/embed/ioPES8OreeY"
                title="Cursos TAG - Enero 2025"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                frameBorder="0"
              ></iframe>
            </div>
          </div>

          {/* CTA Button - Visible on all devices */}
          <button
            ref={inlineButtonRef}
            className="w-full bg-tag-yellow text-black px-6 py-4 sm:px-8 sm:py-5 font-druk text-lg sm:text-xl uppercase hover:bg-white transition-colors duration-300 shadow-lg flex items-center justify-center gap-2 mt-8 mb-8"
            onClick={handleCTAClick}
          >
            CONTACTAR POR WHATSAPP
          </button>
        </div>
      </div>

      {/* Fixed Bottom CTA - Mobile */}
      {isMobile && (
        <button
          className={`fixed bottom-6 left-6 right-6 bg-tag-yellow text-black px-6 py-4 font-druk text-lg uppercase shadow-lg z-50 flex items-center justify-center gap-2 transition-all duration-500 ease-out ${
            showFixedButton ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-12 pointer-events-none'
          }`}
          onClick={handleCTAClick}
        >
          CONTACTAR POR WHATSAPP
        </button>
      )}
    </section>
  );
};

export default LandingSales;

