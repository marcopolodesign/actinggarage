import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import Logo from '../assets/Logo';
// Video will be loaded from public folder
import AnimatedMarquee from '../components/AnimatedMarquee';
import CursosHome from '../components/CursosHome';
import TagSteps from '../components/TagSteps';
import Testimonios from '../components/Testimonios';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

import { useFormFlyout } from '../context/FormFlyoutContext';
import { useAboutFlyout } from '../context/AboutFlyoutContext';

// Component for animated text with character splitting
const AnimatedText: React.FC<{ 
  text: string; 
  className?: string; 
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ text, className, href, onClick }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!textRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            const spans = entry.target.querySelectorAll('span');
            
            // Set initial state - each character starts hidden below
            gsap.set(spans, { 
              y: "100%",
              autoAlpha: 0
            });
            
            // Animate each character with stagger
            gsap.to(spans, {
              y: "0%",
              autoAlpha: 1,
              duration: 0.6,
              ease: 'cubic-bezier(0.4, 0, 0, 1)',
              stagger: 0.02
            });

            setHasAnimated(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Start animation slightly before fully visible
      }
    );

    observer.observe(textRef.current);

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, [hasAnimated]);

  // Split text into individual characters and wrap each in a span
  const renderCharacters = () => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className="inline-block"
        style={{ fontSize: '5.75rem', lineHeight: '1', transform: 'translateY(100%)', opacity: 0 }} // 3.75rem is 6xl in Tailwind (60px)
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const linkContent = (
    <div ref={textRef} className="overflow-hidden">
      {renderCharacters()}
    </div>
  );

  if (href) {
    return (
      <a 
        href={href}
        onClick={onClick}
        className={className}
      >
        {linkContent}
      </a>
    );
  }

  return (
    <div className={className}>
      {linkContent}
    </div>
  );
};

const Home: React.FC = () => {
  const { openFlyout } = useFormFlyout();
  const { openFlyout: openAboutFlyout } = useAboutFlyout();

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openFlyout();
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openAboutFlyout();
  };


  return (
    <section>
    {/* SEO Meta Tags for Home Page */}
    <Helmet>
      <title>The Acting Garage - Escuela de Interpretación para Cine y Teatro</title>
      <meta name="title" content="The Acting Garage - Escuela de Interpretación para Cine y Teatro" />
      <meta name="description" content="Formaciones profesionales en interpretación para cine y teatro. Desarrolla técnica, actitud y autenticidad con profesionales en activo. Cursos para todas las edades." />
      
      {/* Open Graph */}
      <meta property="og:url" content="https://actinggarage.com/" />
      
      {/* Canonical */}
      <link rel="canonical" content="https://actinggarage.com/" />
    </Helmet>
    
    {/* Header - shows after scrolling past first viewport */}
    <Header showOnScroll={true} />
    
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <video 
        className="absolute inset-0 w-full h-full object-contain object-top object-left z-0"
        autoPlay 
        muted 
        loop 
        playsInline
      >
        <source src="/content/tag-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {/* Left gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-full bg-gradient-to-r from-black to-transparent"></div>
        {/* Right gradient */}
        {/* <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent"></div> */}
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen p-8 text-yellow-400">
        {/* Top Section */}
        <div className="flex flex-col items-center">
          <Logo />
        </div>
        
        {/* Center Section - CTA */}
        <div className="flex flex-col md:flex-row gap-3 justify-center gap-8">
          <a 
            href="#contact" 
            onClick={handleContactClick}
            className="inline-block md:px-12 md:py-6 px-6 py-3 bg-yellow-400 text-black font-bold text-lg uppercase transition-all duration-300 hover:bg-white hover:-translate-y-0.5 text-center tracking-tight md:tracking-normal"
          >
            ARRANCAR TU TRANSFORMACIÓN
          </a>
          <Link 
            to="/cursos"
            className="inline-block md:px-12 md:py-6 px-6 py-3 border-2 border-yellow-400 text-yellow-400 font-bold text-lg uppercase transition-all duration-300 hover:bg-yellow-400 hover:text-black hover:-translate-y-0.5 text-center tracking-tight md:tracking-normal"
          >
            VER CURSOS
          </Link>
        </div>
        
        {/* Bottom Section - Navigation Links */}
        <div className="flex justify-between">
          <AnimatedText
            text="contact"
            href="#contact"
            onClick={handleContactClick}
            className="text-white text-6xl  hover:text-yellow-400 transition-colors duration-300 font-druk"
          />
          <AnimatedText
            text="about"
            href="#about"
            onClick={handleAboutClick}
            className="text-white text-8xl  hover:text-yellow-400 transition-colors duration-300 font-druk"
          />
        </div>
      </div>
      </div>

       {/* Animated Marquee */}
    <div className="relative bg-tag-yellow py-4 z-20">
      <AnimatedMarquee 
        text="TAG YOUR SCENE • TAG YOUR STAGE • TAG YOUR POTENTIAL • TAG YOUR SCENE • TAG YOUR STAGE • TAG YOUR POTENTIAL • TAG YOUR SCENE • TAG YOUR STAGE • TAG YOUR POTENTIAL • "
      />
    </div>
    
     {/* Cursos Sections */}
     <CursosHome />
     
     {/* Tag Steps Sections */}
     <TagSteps />
     
     {/* Testimonios Section */}
     <Testimonios />
     </section>


  );
};

export default Home;