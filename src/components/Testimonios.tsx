import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Component for animated text with character splitting
const AnimatedText: React.FC<{ 
  text: string; 
  className?: string;
  style?: React.CSSProperties;
}> = ({ text, className, style }) => {
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
        className="inline-block font-druk"
        style={style}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div ref={textRef} className={`overflow-hidden ${className}`}>
      {renderCharacters()}
    </div>
  );
};

const Testimonios: React.FC = () => {
  // Testimonials data
  const testimonialsData = [
    {
      id: 1,
      quote: "TAG me cambió la vida. Aquí encontré mi voz como actor y desarrollé habilidades que nunca pensé que tenía.",
      author: "Miguel Álvarez"
    },
    {
      id: 2,
      quote: "La metodología de TAG es única. Aprendes desde la técnica hasta la emoción, todo de manera integral.",
      author: "Lucía Moreno"
    },
    {
      id: 3,
      quote: "Los profesores son profesionales en activo que realmente saben del oficio. Una experiencia increíble.",
      author: "Javier García"
    },
    {
      id: 4,
      quote: "TAG no es solo una escuela, es una comunidad donde creces como artista y como persona.",
      author: "Sandra Pérez"
    },
    {
      id: 5,
      quote: "La formación en TAG me preparó para enfrentar cualquier reto en el mundo del cine y el teatro.",
      author: "Daniela Romero"
    },
    {
      id: 6,
      quote: "Cada clase es una oportunidad de descubrir algo nuevo sobre ti mismo y tu potencial como actor.",
      author: "Isabel Sánchez"
    },
    {
      id: 7,
      quote: "TAG me dio las herramientas técnicas y la confianza necesaria para perseguir mis sueños.",
      author: "Alberto Hernández"
    },
    {
      id: 8,
      quote: "Una experiencia transformadora que va más allá de aprender a actuar. Aquí encontré mi propósito.",
      author: "Patricia Castaño"
    }
  ];

  return (
    <div className="md:p-8 p-4 md:m-8 m-4 bg-[#222222] rounded-2xl" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Title */}
      <div className="mb-16">
        <AnimatedText
          text="Testimonios"
          className="text-6xl md:text-8xl"
          style={{ color: '#FFFFFF' }}
        />
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {testimonialsData.map((testimonial) => (
          <div
            key={testimonial.id}
            className="p-6 rounded-2xl border-2"
            style={{
              backgroundColor: '#4A452A',
              borderColor: '#D4AF37'
            }}
          >
            {/* Quote */}
            <p 
              className="text-white text-base leading-relaxed mb-6 text-left"
              style={{ fontFamily: 'helvetica, sans-serif' }}
            >
              "{testimonial.quote}"
            </p>
            
            {/* Author */}
            <p 
              className="text-white text-sm font-bold text-right uppercase"
            >
              — {testimonial.author}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonios;
