import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAboutFlyout } from '../context/AboutFlyoutContext';

const AboutFlyout: React.FC = () => {
  const { isOpen, closeFlyout } = useAboutFlyout();
  const flyoutRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when flyout is open
      document.body.style.overflow = 'hidden';
      
      if (flyoutRef.current && overlayRef.current) {
        // Set initial state
        gsap.set(flyoutRef.current, { x: '100%' });
        gsap.set(overlayRef.current, { opacity: 0 });
        
        // Animate in
        gsap.to(flyoutRef.current, {
          x: '0%',
          duration: 0.5,
          ease: 'power3.out'
        });
        
        gsap.to(overlayRef.current, {
          opacity: 0.5,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
      
      if (flyoutRef.current && overlayRef.current) {
        // Animate out
        gsap.to(flyoutRef.current, {
          x: '100%',
          duration: 0.4,
          ease: 'power3.in'
        });
        
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in'
        });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeFlyout}
      />
      
      {/* About Sidecart */}
      <div
        ref={flyoutRef}
        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-tag-yellow z-50 overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={closeFlyout}
          className="absolute top-8 right-8 text-black hover:opacity-70 transition-opacity"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Content */}
        <div className="p-12 pt-20">
          {/* About Title */}
          <div className="text-right mb-16">
            <h1 className="font-druk text-black uppercase" style={{ fontSize: '6rem', lineHeight: '1' }}>about</h1>
          </div>
          
          {/* Main Heading */}
          <div className="text-center mb-12">
            <div className="font-druk text-black uppercase" style={{ fontSize: '2.5rem', lineHeight: '1.1' }}>
              <div className="mb-4">SOMOS UN ESPACIO DE TRANSFORMACIÓN CREATIVA
              DONDE LA TÉCNICA SE ENCUENTRA   CON     ACTITUD</div>
            </div>
          </div>
          
          {/* Subtitle */}
          <div className="text-center mb-12">
            <div className="text-black italic font-serif" style={{ fontSize: '1.5rem' }}>
              [ Teatro & Cine ]
            </div>
          </div>
          
          {/* Description */}
          <div className="text-left max-w-4xl mx-auto">
            <div className="text-xl text-black uppercase leading-relaxed space-y-4">
              <div>no solo es una escuela de interpretación, Aquí no solo actúas: <br></br><b>evolucionas, descubres tu voz auténtica, tus fortalezas preparándote para cualquier audición y para la vida</b></div>
            </div>
          </div>

          {/* Address Section */}
          <div className="mt-16">
            <div className="text-black">
              <div className="font-druk text-2xl uppercase mb-6 text-center">
                UBICACIÓN
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-lg">
                  Carrer de Londres, 9<br />
                  L'Eixample, 08029<br />
                  Barcelona, Spain
                </div>
                <a
                  href="https://www.google.com/maps/place/Carrer+de+Londres,+9,+L'Eixample,+08029+Barcelona,+Spain/data=!4m2!3m1!1s0x12a49878613bff27:0xc2d93dd84d4d7877?sa=X&ved=1t:242&ictx=111"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{color: '#FFBE00'}}
                  className="bg-black text-tag-yellow px-8 py-3 font-druk text-lg uppercase tracking-wide hover:opacity-80 transition-opacity"
                >
                  Ver Mapa
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutFlyout;
