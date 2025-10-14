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
          opacity: 1,
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
          className="absolute top-8 right-8 text-black text-2xl font-bold hover:opacity-70 transition-opacity"
        >
          ×
        </button>
        
        {/* Content */}
        <div className="p-12 pt-20">
          {/* About Title */}
          <div className="text-right mb-16">
            <h1 className="font-druk text-black" style={{ fontSize: '6rem', lineHeight: '1' }}>about</h1>
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
              <div>no solo es una escuela de interpretación, Aquí no solo actuas: <br></br><b>evolucionas, descubres tu voz auténtica, tus fortalezas preparandote para cualquier audición y para la vida</b></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutFlyout;
