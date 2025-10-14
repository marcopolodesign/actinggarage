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

// Component for animated line that expands from 0 to full width
const AnimatedLine: React.FC<{ 
  className?: string;
  style?: React.CSSProperties;
}> = ({ className, style }) => {
  const lineRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!lineRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            // Set initial state - line starts with 0 width
            gsap.set(lineRef.current, { 
              width: "0%"
            });
            
            // Animate line to full width
            gsap.to(lineRef.current, {
              width: "100%",
              duration: 1.2,
              ease: 'cubic-bezier(0.4, 0, 0, 1)',
              delay: 0.5 // Small delay after text animation
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

    observer.observe(lineRef.current);

    return () => {
      if (lineRef.current) {
        observer.unobserve(lineRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <div ref={lineRef} className={`h-px ${className}`} style={style} />
  );
};

const CursosHome = () => {


  const cursosData = [
    {
      id: 'cine',
      mainText: 'Cine',
      mainTagline: 'TAG YOUR SCENE',
      description: 'Desarrollas una narrativa cinematográfica distintiva, construyendo personajes complejos y escenas que trascienden la pantalla. Descubres el lenguaje de la cámara y lo conviertes en tu aliado para crear historias que se sientan reales.',
      cursoName: 'GARAGE CINEMA',
      buttonText: 'VER CURSOS',
      backgroundColor: '#FFBE00', // tag-yellow
      textColor: '#000000', // black
      buttonTextColor: '#000000',
      buttonBorderColor: '#000000',
      containerWidth: '50%', // Full width
      noiseEffect: false // No noise for yellow background
    },
    {
      id: 'teatro',
      mainText: 'Teatro',
      mainTagline: 'TAG YOUR STAGE',
      description: 'Exploras la profundidad del arte teatral, desarrollando técnicas de actuación que conectan con la audiencia de manera auténtica. Construyes personajes memorables y dominas el espacio escénico.',
      cursoName: 'GARAGE THEATER',
      buttonText: 'VER CURSOS',
      backgroundColor: '#FFBE00', // tag-yellow
      textColor: '#000000', // black
      buttonTextColor: '#000000',
      buttonBorderColor: '#000000',
      containerWidth: '50%', // Full width
      noiseEffect: false // No noise for yellow background
    }, 
        {
        id: 'teatro-cine',
        mainText: 'Teatro & Cine',
        mainTagline: 'TAG YOUR STAGE',
        description: 'En TAG trabajamos la interpretación desde el teatro y el cine como dos lenguajes que se potencian entre sí. Aprendes a dominar la técnica, la cámara y el escenario con autenticidad, construyendo personajes con profundidad, presencia y emoción. Exploras la conexión entre ambos mundos para transformar la técnica en experiencia y la emoción en impacto.',
        courses: [
          'GARAGE PRO',
          'GARAGE HYBRID',
          'GARAGE HYBRID PLUS',
          'GARAGE EVOLUTION',
          'GARAGE CLASSIC',
          'GARAGE WORKSHOPS'
        ],
        buttonText: 'VER TODOS LOS CURSOS',
        backgroundColor: '#5F3000', // brown
        textColor: '#FFFFFF', // white text
        buttonTextColor: '#FFFFFF',
        buttonBorderColor: '#FFBE00',
        containerWidth: '100%', // Full width
        noiseEffect: true // Enable noise effect for brown background
      }
  ];


  return (
    <div className="flex flex-wrap md:p-8 p-4 gap-4">
      {cursosData.map((curso) => (
        <div 
          key={curso.id}
          className={`relative flex flex-col justify-between p-8 mx-auto rounded-2xl ${curso.containerWidth === '100%' ? '' : ' flex-1'} ${curso.noiseEffect ? 'noise-effect' : ''}`}
          style={{ 
            backgroundColor: curso.backgroundColor,
            width: curso.containerWidth || '100%'
          }}
        >
          {/* Top Section - Main Text and Button */}
          <div className="flex flex-col md:flex-row justify-between items-start relative z-10">
            {/* Left Side - Main Text */}
            <div className="flex flex-col">
              <AnimatedText
                text={curso.mainText}
                className="text-[150px] md:text-[17.5vw] leading-[1] md:leading-tight md:whitespace-nowrap tracking-[-0.012em]"
                style={{ color: curso.textColor }}
              />
              <h2 
                className="text-2xl uppercase md:-mt-12 mb-6"
                style={{ color: curso.textColor }}
              >
                {curso.mainTagline}
              </h2>
              <p 
                className="text-lg md:max-w-2xl leading-relaxed md:mb-24 mb-6"
                style={{ color: curso.textColor }}
              >
                {curso.description}
              </p>
            </div>
            
            {/* Right Side - Button */}
            <button 
              className="px-8 py-4 border uppercase font-semibold text-sm transition-all duration-300 rounded-full whitespace-nowrap"
              style={{ 
                borderColor: curso.buttonBorderColor || curso.textColor,
                backgroundColor: 'transparent',
                color: curso.buttonTextColor || curso.textColor
              }}
            >
              {curso.buttonText}
            </button>
          </div>
          
          {/* Bottom Section - Courses */}
          <div className="relative z-10 hidden md:block">
            {curso.courses ? (
              // Render courses in two columns
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {curso.courses.map((course, index) => (
                    <div className='flex flex-col gap-4'>
                    <div key={index} className="flex items-center">
                      <h3 
                        className="font-druk text-lg uppercase"
                        style={{ color: curso.textColor }}
                      >
                        {course}
                      </h3>
                      <span 
                        className="ml-4 text-lg"
                        style={{ color: curso.textColor }}
                      >
                        +
                      </span>
                    </div>

                        <AnimatedLine 
                        className="w-full"
                        style={{ backgroundColor: curso.textColor }}
                        />
                        </div>
     
                  ))}
                </div>
                {/* Animated line between courses */}
            
              </div>
            ) : (
              // Fallback for single cursoName (backward compatibility)
              <div className="flex items-center">
                <h3 
                  className="font-druk text-2xl uppercase"
                  style={{ color: curso.textColor }}
                >
                  {curso.cursoName}
                </h3>
                <div className="flex items-center ml-8 flex-1">
                  <div 
                    className="h-px flex-1"
                    style={{ backgroundColor: curso.textColor }}
                  ></div>
                  <span 
                    className="ml-4 text-2xl"
                    style={{ color: curso.textColor }}
                  >
                    +
                  </span>
                </div>
                <AnimatedLine 
                  className="w-full"
                  style={{ backgroundColor: curso.textColor }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CursosHome;
