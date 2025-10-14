import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

const PageTransition: React.FC = () => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Create timeline for the transition
    const tl = gsap.timeline();

    // Start with gradient that shows content (transparent center)
    gsap.set(overlay, {
      background: 'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 100%)',
      opacity: 1
    });

    // Animate the gradient to close in from edges to center
    tl.to(overlay, {
      background: 'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 100%)',
      duration: 0.4,
      ease: 'power2.inOut'
    })
    // Hold the black screen briefly
    .to({}, { duration: 0.1 })
    // Fade out to reveal new page
    .to(overlay, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut'
    });

  }, [location.pathname]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{
        background: 'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 100%)',
        opacity: 0
      }}
    />
  );
};

export default PageTransition;
