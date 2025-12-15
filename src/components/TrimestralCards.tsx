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
    backgroundColor: 'transparent',
    textColor: '#FFFFFF',
    buttonTextColor: '#FFFFFF',
    buttonBorderColor: '#FFFFFF'
  },
  {
    id: 'teatro-ii',
    title: 'Trimestral Teatro II',
    tagline: 'Nivel Avanzado',
    description: 'Nivel avanzado de teatro. Profundiza en técnicas de interpretación, construcción de personajes y presencia escénica. Para quienes ya tienen experiencia en teatro.',
    backgroundColor: 'transparent',
    textColor: '#FFFFFF',
    buttonTextColor: '#FFFFFF',
    buttonBorderColor: '#FFFFFF'
  },
  {
    id: 'camara-i',
    title: 'Trimestral Cámara I',
    tagline: 'Actuación para Cámara',
    description: 'Introducción a la actuación frente a cámara. Aprende técnicas específicas para cine y televisión, naturalidad y trabajo con planos. Perfecto para iniciarse en el mundo audiovisual.',
    backgroundColor: 'transparent',
    textColor: '#FFFFFF',
    buttonTextColor: '#FFFFFF',
    buttonBorderColor: '#FFFFFF'
  },
  {
    id: 'camara-ii',
    title: 'Trimestral Cámara II',
    tagline: 'Profesionalización Audiovisual',
    description: 'Nivel avanzado de actuación para cámara. Trabajo intensivo en escenas complejas, monólogos y casting. Para actores con experiencia que buscan profesionalizarse.',
    backgroundColor: 'transparent',
    textColor: '#FFFFFF',
    buttonTextColor: '#FFFFFF',
    buttonBorderColor: '#FFFFFF'
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
    const urlParams = new URLSearchParams(window.location.search);
    const hasUtm = urlParams.has('utm_source') || urlParams.has('utm_medium') || urlParams.has('utm_campaign');
    const message = hasUtm
      ? encodeURIComponent(`Hola! Quisiera obtener más información sobre el curso: ${courseTitle}`)
      : encodeURIComponent(`Hola! Me interesa obtener más información sobre el curso: ${courseTitle}`);
    const whatsappUrl = `https://wa.me/34682560187?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="w-full px-4 md:px-6 py-6 md:py-8">
      {/* Title */}
      <AnimatedText
        text="Nuevos cursos semestrales. Inicio enero 2025"
        className="text-2xl md:text-3xl font-druk mb-4 md:mb-6"
        style={{ color: '#FFFFFF' }}
      />
      
      {/* Flex Wrap Container - Desktop */}
      <div className="hidden md:flex flex-wrap gap-3">
        {trimestralCourses.map((course, index) => (
          <div
            key={course.id}
            ref={(el) => { cardRefs.current[index] = el; }}
            className="relative flex flex-col justify-between p-4 md:p-5 rounded-xl opacity-0 border border-white flex-1 min-w-[calc(25%-0.75rem)]"
            style={{
              backgroundColor: 'transparent'
            }}
          >
            {/* Top Section - Title and Tagline */}
            <div className="flex flex-col mb-2">
              <h3
                className="text-xl font-druk mb-1"
                style={{ color: course.textColor }}
              >
                {course.title}
              </h3>
              <h4
                className="text-xs uppercase mb-2"
                style={{ color: course.textColor }}
              >
                {course.tagline}
              </h4>
            </div>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-4 font-garamond flex-grow"
              style={{ color: course.textColor }}
            >
              {course.description}
            </p>

            {/* Bottom Section - Button */}
            <div className="flex flex-col gap-2">
              <button
                onClick={(e) => handleWhatsAppClick(course.title, e)}
                className="px-4 py-2 border uppercase font-semibold text-xs transition-all duration-300 rounded-full w-full"
                style={{
                  borderColor: course.buttonBorderColor,
                  backgroundColor: 'transparent',
                  color: course.buttonTextColor
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#000000';
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
      <div className="flex flex-col md:hidden gap-3">
        {trimestralCourses.map((course, index) => (
          <div
            key={course.id}
            ref={(el) => { cardRefs.current[index + trimestralCourses.length] = el; }}
            className="relative flex flex-col justify-between p-4 rounded-xl w-full opacity-0 border border-white"
            style={{
              backgroundColor: 'transparent'
            }}
          >
            {/* Top Section - Title and Tagline */}
            <div className="flex flex-col mb-2">
              <h3
                className="text-xl font-druk mb-1"
                style={{ color: course.textColor }}
              >
                {course.title}
              </h3>
              <h4
                className="text-xs uppercase mb-2"
                style={{ color: course.textColor }}
              >
                {course.tagline}
              </h4>
            </div>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-4 font-garamond flex-grow"
              style={{ color: course.textColor }}
            >
              {course.description}
            </p>

            {/* Bottom Section - Button */}
            <div className="flex flex-col gap-2">
              <button
                onClick={(e) => handleWhatsAppClick(course.title, e)}
                className="px-4 py-2 border uppercase font-semibold text-xs transition-all duration-300 rounded-full w-full"
                style={{
                  borderColor: course.buttonBorderColor,
                  backgroundColor: 'transparent',
                  color: course.buttonTextColor
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#000000';
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

