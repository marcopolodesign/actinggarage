import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface Course {
  id: string;
  title: string;
  tagline: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  buttonTextColor: string;
  buttonBorderColor: string;
}

const trimestralCourses: Course[] = [
  {
    id: 'teatro-i',
    title: 'Trimestral Teatro I',
    tagline: 'Fundamentos Teatrales',
    description: 'Curso introductorio al teatro. Aprende los fundamentos de la actuación escénica, expresión corporal y vocal. Ideal para quienes quieren dar sus primeros pasos en el mundo del teatro.',
    backgroundColor: '#FFBE00',
    textColor: '#000000',
    buttonTextColor: '#000000',
    buttonBorderColor: '#000000'
  },
  {
    id: 'teatro-ii',
    title: 'Trimestral Teatro II',
    tagline: 'Nivel Avanzado',
    description: 'Nivel avanzado de teatro. Profundiza en técnicas de interpretación, construcción de personajes y presencia escénica. Para quienes ya tienen experiencia en teatro.',
    backgroundColor: '#FFBE00',
    textColor: '#000000',
    buttonTextColor: '#000000',
    buttonBorderColor: '#000000'
  },
  {
    id: 'camara-i',
    title: 'Trimestral Cámara I',
    tagline: 'Actuación para Cámara',
    description: 'Introducción a la actuación frente a cámara. Aprende técnicas específicas para cine y televisión, naturalidad y trabajo con planos. Perfecto para iniciarse en el mundo audiovisual.',
    backgroundColor: '#FFBE00',
    textColor: '#000000',
    buttonTextColor: '#000000',
    buttonBorderColor: '#000000'
  },
  {
    id: 'camara-ii',
    title: 'Trimestral Cámara II',
    tagline: 'Profesionalización Audiovisual',
    description: 'Nivel avanzado de actuación para cámara. Trabajo intensivo en escenas complejas, monólogos y casting. Para actores con experiencia que buscan profesionalizarse.',
    backgroundColor: '#FFBE00',
    textColor: '#000000',
    buttonTextColor: '#000000',
    buttonBorderColor: '#000000'
  }
];

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
            
            gsap.set(spans, { 
              y: "100%",
              autoAlpha: 0
            });
            
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
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(textRef.current);

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, [hasAnimated]);

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

const TrimestralCards: React.FC = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [animatedCards, setAnimatedCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((card, index) => {
      if (!card || animatedCards.has(index)) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !animatedCards.has(index)) {
              gsap.fromTo(card,
                {
                  opacity: 0,
                  y: 30
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: 'cubic-bezier(0.4, 0, 0, 1)',
                  delay: index * 0.1
                }
              );
              setAnimatedCards(prev => new Set(prev).add(index));
              observer.unobserve(card);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      observer.observe(card);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [animatedCards]);

  const handleWhatsAppClick = (courseTitle: string, e: React.MouseEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(`Hola! Me interesa obtener más información sobre el curso: ${courseTitle}`);
    const whatsappUrl = `https://wa.me/34682560187?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="w-full px-4 md:px-8 bg-black py-8 md:py-12">
      {/* Title */}
      <AnimatedText
        text="Nuevos cursos semestrales. Inicio enero 2025"
        className="text-5xl font-druk mb-6 md:mb-8"
        style={{ color: '#FFBE00' }}
      />
      
      {/* Horizontal Scroll Container - Desktop */}
      <div className="hidden md:flex overflow-x-auto gap-4 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {trimestralCourses.map((course, index) => (
          <div
            key={course.id}
            ref={(el) => { cardRefs.current[index] = el; }}
            className="relative flex flex-col justify-between p-6 md:p-8 rounded-2xl flex-shrink-0 h-full opacity-0"
            style={{
              backgroundColor: course.backgroundColor,
              maxWidth: '40vw',
              minWidth: '40vw'
            }}
          >
            {/* Top Section - Title and Tagline */}
            <div className="flex flex-col mb-4">
              <h3
                className="text-3xl font-druk mb-2"
                style={{ color: course.textColor }}
              >
                {course.title}
              </h3>
              <h4
                className="text-base uppercase mb-4"
                style={{ color: course.textColor }}
              >
                {course.tagline}
              </h4>
            </div>

            {/* Description */}
            <p
              className="text-base leading-relaxed mb-6 font-garamond flex-grow"
              style={{ color: course.textColor }}
            >
              {course.description}
            </p>

            {/* Bottom Section - Button */}
            <div className="flex flex-col gap-4">
              <button
                onClick={(e) => handleWhatsAppClick(course.title, e)}
                className="px-6 py-3 border uppercase font-semibold text-sm transition-all duration-300 rounded-full w-full"
                style={{
                  borderColor: course.buttonBorderColor,
                  backgroundColor: 'transparent',
                  color: course.buttonTextColor
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = course.buttonBorderColor === '#000000' ? '#000000' : course.buttonBorderColor;
                  e.currentTarget.style.color = course.buttonBorderColor === '#000000' ? '#FFBE00' : '#000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = course.buttonTextColor;
                }}
              >
                Más información
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vertical Stack - Mobile */}
      <div className="flex flex-col md:hidden gap-4">
        {trimestralCourses.map((course, index) => (
          <div
            key={course.id}
            ref={(el) => { cardRefs.current[index + trimestralCourses.length] = el; }}
            className="relative flex flex-col justify-between p-6 rounded-2xl w-full opacity-0"
            style={{
              backgroundColor: course.backgroundColor
            }}
          >
            {/* Top Section - Title and Tagline */}
            <div className="flex flex-col mb-4">
              <h3
                className="text-3xl font-druk mb-2"
                style={{ color: course.textColor }}
              >
                {course.title}
              </h3>
              <h4
                className="text-base uppercase mb-4"
                style={{ color: course.textColor }}
              >
                {course.tagline}
              </h4>
            </div>

            {/* Description */}
            <p
              className="text-base leading-relaxed mb-6 font-garamond flex-grow"
              style={{ color: course.textColor }}
            >
              {course.description}
            </p>

            {/* Bottom Section - Button */}
            <div className="flex flex-col gap-4">
              <button
                onClick={(e) => handleWhatsAppClick(course.title, e)}
                className="px-6 py-3 border uppercase font-semibold text-sm transition-all duration-300 rounded-full w-full"
                style={{
                  borderColor: course.buttonBorderColor,
                  backgroundColor: 'transparent',
                  color: course.buttonTextColor
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = course.buttonBorderColor === '#000000' ? '#000000' : course.buttonBorderColor;
                  e.currentTarget.style.color = course.buttonBorderColor === '#000000' ? '#FFBE00' : '#000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = course.buttonTextColor;
                }}
              >
                Más información
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrimestralCards;

