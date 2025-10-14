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
        style={{ ...style, transform: 'translateY(100%)', opacity: 0 }}
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

const TagSteps: React.FC = () => {
  // Tag steps data
  const tagStepsData = [
    {
      id: 'descubrimiento',
      image: '/content/descubrimiento.jpg',
      title: 'Descubrimiento',
      tagline: 'TAG YOUR POTENTIAL',
      description: 'Dominas las bases del cine y del teatro con profesionales en activo, entendiendo que la técnica solo cobra sentido cuando se conecta con la actitud. Aquí aprendes a habitar la cámara, el escenario y cada personaje con presencia, intención y verdad.',
      backgroundColor: '#DB9A00'
    },
    {
      id: 'tecnica',
      image: '/content/tecnica.jpg',
      title: 'Técnica',
      tagline: 'TAG YOUR TALENT',
      description: 'Dominas las bases del cine y del teatro con profesionales en activo, entendiendo que la técnica solo cobra sentido cuando se conecta con la actitud. Aquí aprendes a habitar la cámara, el escenario y cada personaje con presencia, intención y verdad.',
      backgroundColor: '#B67B00'
    },
    {
      id: 'transformacion',
      image: '/content/transformacion.jpg',
      title: 'Transformación',
      tagline: 'TAG YOUR ACT',
      description: 'Dominas las bases del cine y del teatro con profesionales en activo, entendiendo que la técnica solo cobra sentido cuando se conecta con la actitud. Aquí aprendes a habitar la cámara, el escenario y cada personaje con presencia, intención y verdad.',
      backgroundColor: '#925B00'
    },
    {
      id: 'proyeccion',
      image: '/content/proyeccion.jpg',
      title: 'Proyección',
      tagline: 'TAG YOUR PERFORMANCE',
      description: 'Dominas las bases del cine y del teatro con profesionales en activo, entendiendo que la técnica solo cobra sentido cuando se conecta con la actitud. Aquí aprendes a habitar la cámara, el escenario y cada personaje con presencia, intención y verdad.',
      backgroundColor: '#6D3C00'
    },
    {
      id: 'comunidad',
      image: '/content/comunidad.jpg',
      title: 'Comunidad',
      tagline: 'LEAVE YOUR TAG',
      description: 'Dominas las bases del cine y del teatro con profesionales en activo, entendiendo que la técnica solo cobra sentido cuando se conecta con la actitud. Aquí aprendes a habitar la cámara, el escenario y cada personaje con presencia, intención y verdad.',
      backgroundColor: '#491C00'
    }
  ];

  return (
    <div className="md:p-8 p-4 gap-8 flex flex-col">
      {tagStepsData.map((step) => (
        <div 
          key={step.id}
          className="flex flex-col md:flex-row rounded-2xl overflow-hidden"
          style={{ backgroundColor: step.backgroundColor }}
        >
          {/* Left Section - Image */}
          <div className="md:w-2/5 relative overflow-hidden">
            <img 
              src={step.image}
              alt={step.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Right Section - Text Content */}
          <div className="md:w-3/5 flex flex-col justify-center md:p-16 p-8 relative z-10">
            <AnimatedText
              text={step.title}
              className="text-7xl md:text-8xl mb-6"
              style={{ color: '#FFFFFF' }}
            />
            
            <h2 
              className="-mt-6 uppercase mb-8 md:text-lg text-base md:max-w-2xl leading-relaxed md:mb-24 tracking-tightest md:tracking-normal"
              style={{ color: '#FFFFFF' }}
            >
              {step.tagline}
            </h2>
            
            <p 
              className="max-w-2xl font-helvetica md:text-lg text-base md:max-w-2xl leading-relaxed md:mb-24 mb-6 tracking-tightest md:tracking-normal"
              style={{ color: '#FFFFFF' }}
            >
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TagSteps;
