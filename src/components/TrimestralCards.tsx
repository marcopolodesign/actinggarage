import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  tagline: string;
  description: string;
  href: string;
  backgroundColor: string;
  textColor: string;
  buttonTextColor: string;
  buttonBorderColor: string;
}

const trimestralCourses: Course[] = [
  {
    id: 'casal',
    title: 'Garage Casal',
    tagline: 'Verano 2026 · 7–13 años',
    description: 'Casal de verano (22 jun–24 jul). Teatro + teatro musical por semanas, con función semanal grabada para familias.',
    href: '/cursos/garage-casal',
    backgroundColor: 'transparent',
    textColor: '#FFFFFF',
    buttonTextColor: '#FFFFFF',
    buttonBorderColor: '#FFFFFF'
  },
  {
    id: 'hybrid-julio',
    title: 'Garage Hybrid Julio',
    tagline: 'Verano 2026 · Adultos · Iniciación',
    description: '4 semanas intensivas (6–30 jul). Teatro (L+M) y cámara (X+J) de 19–21h. 32h totales.',
    href: '/cursos/garage-hybrid-julio',
    backgroundColor: 'transparent',
    textColor: '#FFFFFF',
    buttonTextColor: '#FFFFFF',
    buttonBorderColor: '#FFFFFF'
  },
  {
    id: 'new-generation-julio',
    title: 'New Generation Julio',
    tagline: 'Verano 2026 · 13–17 años',
    description: '4 semanas (29 jun–24 jul). 4h diarias (10–14h): teatro + cámara, con rodajes por semana.',
    href: '/cursos/garage-new-generation-julio',
    backgroundColor: 'transparent',
    textColor: '#FFFFFF',
    buttonTextColor: '#FFFFFF',
    buttonBorderColor: '#FFFFFF'
  },
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

  return (
    <div className="w-full px-4 md:px-6 py-6 md:py-8">
      {/* Title */}
      <AnimatedText
        text="Verano 2026 — cursos intensivos"
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
              <Link
                to={course.href}
                className="px-4 py-2 border uppercase font-semibold text-xs transition-all duration-300 rounded-full w-full text-center"
                style={{
                  borderColor: course.buttonBorderColor,
                  backgroundColor: 'transparent',
                  color: course.buttonTextColor
                }}
              >
                Ver info
              </Link>
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
              <Link
                to={course.href}
                className="px-4 py-2 border uppercase font-semibold text-xs transition-all duration-300 rounded-full w-full text-center"
                style={{
                  borderColor: course.buttonBorderColor,
                  backgroundColor: 'transparent',
                  color: course.buttonTextColor
                }}
              >
                Ver info
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrimestralCards;

