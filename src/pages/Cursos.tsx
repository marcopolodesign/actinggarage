import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Testimonios from '../components/Testimonios';
import TrimestralCards from '../components/TrimestralCards';
import { useFormFlyout } from '../context/FormFlyoutContext';

const Cursos: React.FC = () => {
  const cursosTextRef = useRef<HTMLSpanElement>(null);
  const tagTextRef = useRef<HTMLSpanElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const coursesRef = useRef<(HTMLDivElement | null)[]>([]);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Courses data
  const coursesData = [
    {
      title: 'Garage Pro',
      description: 'Formación integral para actores y actrices que buscan profesionalizarse. Entrenamiento completo en interpretación, cámara, cuerpo, voz, movimiento, improvisación, lucha escénica, danza y otras disciplinas esenciales.',
      duracion: '3 años',
      diasSemana: '4',
      cargaHoraria: '16 horas',
      edades: 'Desde 17 años',
      modalidad: 'Teatro + Cine (integral)',
      objetivo: 'Profesionalización actoral'
    },
    {
      title: 'Garage Theatre',
      description: 'Curso de introducción al teatro. Formación práctica y divertida para quienes desean descubrir su potencial expresivo y conectar con su creatividad.',
      duracion: '3 años',
      diasSemana: '1',
      cargaHoraria: '2 horas',
      edades: '17 a 60 años',
      modalidad: 'Teatro',
      objetivo: 'Iniciación y desarrollo personal'
    },
    {
      title: 'Garage Cinema',
      description: 'Curso de iniciación en la interpretación frente a cámara. Desde el primer día se trabaja con cámara y ejercicios prácticos para ganar naturalidad y técnica audiovisual.',
      duracion: '3 años',
      diasSemana: '1',
      cargaHoraria: '2 horas',
      edades: '17 a 60 años',
      modalidad: 'Cine',
      objetivo: 'Iniciación actoral y práctica audiovisual'
    },
    {
      title: 'Garage Hybrid',
      description: 'Formación combinada en teatro y cine. Para quienes quieren explorar la interpretación en todas sus vertientes y prepararse para castings o audiciones.',
      duracion: '3 años',
      diasSemana: '2',
      cargaHoraria: '4 horas',
      edades: '17 a 60 años',
      modalidad: 'Teatro + Cine',
      objetivo: 'Profesionalización y preparación para audiciones'
    },
    {
      title: 'Garage Hybrid Plus',
      description: 'Formación integral para quienes buscan profesionalizarse sin la carga del PRO. Entrenamiento en interpretación, cámara, canto y creación.',
      duracion: '3 años',
      diasSemana: '2',
      cargaHoraria: '8 horas',
      edades: '17 a 45 años',
      modalidad: 'Teatro + Cine',
      objetivo: 'Profesionalización actoral adaptable'
    },
    {
      title: 'Garage Kids',
      description: 'Teatro para niños y niñas. Espacio lúdico donde se aprenden los valores del teatro mientras se desarrolla la creatividad y el trabajo en grupo.',
      duracion: 'Curso anual (renovable)',
      diasSemana: '1',
      cargaHoraria: '2 horas',
      edades: '8 a 12 años',
      modalidad: 'Teatro',
      objetivo: 'Aprendizaje, diversión y desarrollo expresivo'
    },
    {
      title: 'Garage New Generation',
      description: 'Teatro para adolescentes. Formación práctica para explorar la interpretación y fortalecer la confianza personal.',
      duracion: 'Curso anual (renovable)',
      diasSemana: '1',
      cargaHoraria: '2 horas',
      edades: '13 a 17 años',
      modalidad: 'Teatro',
      objetivo: 'Descubrimiento y desarrollo artístico'
    },
    {
      title: 'Garage New Generation Hybrid',
      description: 'Formación en teatro y cine para jóvenes. Combina la práctica escénica y audiovisual para quienes quieren orientar sus estudios hacia el arte.',
      duracion: '3 años',
      diasSemana: '2',
      cargaHoraria: '4 horas',
      edades: '13 a 17 años',
      modalidad: 'Teatro + Cine',
      objetivo: 'Formación artística y preparación para el futuro profesional'
    },
    {
      title: 'Garage Evolution',
      description: 'Entrenamiento avanzado para egresados TAG. Programas personalizados para seguir desarrollando técnica, creatividad y autoconocimiento actoral.',
      duracion: 'Continua / anual',
      diasSemana: 'Variable',
      cargaHoraria: 'Personalizada',
      edades: 'Desde 17 años',
      modalidad: 'Entrenamiento personalizado',
      objetivo: 'Perfeccionamiento actoral'
    },
    {
      title: 'Garage Classic',
      description: 'Teatro para mayores de 60. Propuesta de aprendizaje y disfrute a través del teatro, fomentando la memoria, expresión y motricidad.',
      duracion: 'Curso anual',
      diasSemana: '1',
      cargaHoraria: '1 hora y media',
      edades: '60+',
      modalidad: 'Teatro',
      objetivo: 'Bienestar, diversión y desarrollo cognitivo'
    },
    {
      title: 'Garage Workshops',
      description: 'Talleres intensivos de fin de semana. Dictados por profesionales del sector para actores, actrices y estudiantes avanzados.',
      duracion: 'Fin de semana (2-3 días)',
      diasSemana: 'Variable',
      cargaHoraria: 'Intensiva',
      edades: 'Desde 17 años',
      modalidad: 'Taller intensivo',
      objetivo: 'Entrenamiento especializado y networking profesional'
    }
  ];

  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const { openFlyout } = useFormFlyout();

  const toggleCourse = (index: number) => {
    setExpandedCourse(expandedCourse === index ? null : index);
  };

  const handleMoreInfo = (courseTitle: string) => {
    openFlyout(courseTitle);
  };

  // Scroll-based animations
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const scrollProgress = Math.min(scrollY / 200, 1); // FASTER: Changed from 500 to 200
    // const scrollingDown = scrollY > lastScrollY;
    
    // Animate title splitting - "Cursos" moves left, "TAG" moves right (FASTER)
    if (cursosTextRef.current && tagTextRef.current) {
      const moveDistance = scrollProgress * 350; // FASTER: Increased from 200 to 300
      cursosTextRef.current.style.transform = `translateX(-${moveDistance}px)`;
      tagTextRef.current.style.transform = `translateX(${moveDistance}px)`;
    }

    // Animate title fade out/blur on scroll
    if (titleContainerRef.current) {
      const fadeThreshold = 100; // Start fading earlier after 100px
      const fadeProgress = Math.min(Math.max(scrollY - fadeThreshold, 0) / 150, 1);
      
      // Fade out and blur when scrolling down past threshold
      const opacity = 1 - fadeProgress;
      const blurAmount = fadeProgress * 10; // Max 10px blur
      const translateY = -fadeProgress * 30; // Move up 30px
      
      titleContainerRef.current.style.opacity = opacity.toString();
      titleContainerRef.current.style.filter = `blur(${blurAmount}px)`;
      titleContainerRef.current.style.transform = `translateY(${translateY}px)`;
    }

    // Animate background blur
    if (backgroundRef.current) {
      const blurAmount = Math.min(scrollY / 50, 10); // Max 10px blur
      backgroundRef.current.style.filter = `blur(${blurAmount}px)`;
    }

    // Animate description blur - IMMEDIATE on scroll
    const descriptionElement = document.querySelector('.description-text') as HTMLElement;
    if (descriptionElement) {
      const descBlur = Math.min(scrollY / 20, 5); // Immediate blur, max 5px
      descriptionElement.style.filter = `blur(${descBlur}px)`;
      descriptionElement.style.opacity = Math.max(1 - (scrollY / 300), 0).toString();
    }

    // Animate courses opacity (NOT the title)
    // Find the course closest to center and give it full opacity, others get 0.5
    let closestIndex = -1;
    let minDistance = Infinity;
    
    coursesRef.current.forEach((course, index) => {
      if (course) {
        const rect = course.getBoundingClientRect();
        const isMobile = window.innerWidth < 768;
        const center = isMobile ? window.innerHeight / 2.3 : window.innerHeight / 2;
        const distance = Math.abs(rect.top + rect.height / 2 - center);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      }
    });
    
    // Apply opacity based on whether it's the closest
    coursesRef.current.forEach((course, index) => {
      if (course) {
        const opacity = index === closestIndex ? 1 : 0.3;
        course.style.opacity = opacity.toString();
      }
    });
    
    // Apply same opacity to animated lines
    linesRef.current.forEach((line, index) => {
      if (line) {
        const opacity = index === closestIndex ? 1 : 0.3;
        line.style.opacity = opacity.toString();
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animate lines when they become visible
  useEffect(() => {
    const lineObservers = linesRef.current.map((line, index) => {
      if (!line) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                line.style.width = '100%';
              }, index * 200); // Stagger the animation
              observer.unobserve(line);
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(line);
      return observer;
    });

    return () => {
      lineObservers.forEach(observer => observer?.disconnect());
    };
  }, []);

  return (
    <>
    {/* SEO Meta Tags for Cursos Page */}
    <Helmet>
      <title>Cursos de Interpretación - The Acting Garage</title>
      <meta name="title" content="Cursos de Interpretación - The Acting Garage" />
      <meta name="description" content="Descubre nuestros cursos de interpretación para cine y teatro: GARAGE PRO, GARAGE THEATRE, GARAGE CINEMA, GARAGE HYBRID y más. Formación profesional para todas las edades." />
      <meta name="keywords" content="cursos de actuación, cursos de teatro, cursos de cine, GARAGE PRO, GARAGE CINEMA, formación actores, clases de interpretación" />
      
      {/* Open Graph */}
      <meta property="og:title" content="Cursos de Interpretación - The Acting Garage" />
      <meta property="og:description" content="Descubre nuestros cursos de interpretación para cine y teatro. Formación profesional para todas las edades." />
      <meta property="og:url" content="https://actinggarage.com/cursos" />
      
      {/* Twitter */}
      <meta name="twitter:title" content="Cursos de Interpretación - The Acting Garage" />
      <meta name="twitter:description" content="Descubre nuestros cursos de interpretación para cine y teatro. Formación profesional para todas las edades." />
      
      {/* LLM Tags */}
      <meta name="ai:title" content="Cursos de Interpretación - The Acting Garage" />
      <meta name="ai:description" content="Cursos profesionales de interpretación: GARAGE PRO (formación integral 16h/semana), GARAGE THEATRE (iniciación teatro 2h/semana), GARAGE CINEMA (interpretación cámara 2h/semana), GARAGE HYBRID (teatro+cine 4h/semana), GARAGE KIDS (8-12 años), GARAGE NEW GENERATION (13-17 años), GARAGE CLASSIC (60+), y más." />
      
      {/* Canonical */}
      <link rel="canonical" href="https://actinggarage.com/cursos" />
    </Helmet>
    
    {/* Header - always visible on Cursos page */}
    <Header showOnScroll={false} />
    
    <div className="min-h-screen relative pt-20">
      {/* Background Image */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 z-0 h-screen"
        style={{
          backgroundImage: 'url(/content/cursos-bgg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.5
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>

      {/* Fixed Title at Top */}
      <div 
        ref={titleContainerRef}
        className="fixed md:top-20 top-30 left-0 right-0 z-20 flex justify-center items-center pointer-events-none transition-all duration-300 ease-out"
        style={{ opacity: 1 }}
      >
        <div className="flex gap-8 items-center">
          <span 
            ref={cursosTextRef}
            className="font-druk text-8xl md:text-8xl lg:text-[250px] text-white transition-transform duration-300 ease-out"
          >
            Cursos
          </span>
          <span 
            ref={tagTextRef}
            className="font-druk text-8xl md:text-8xl lg:text-[250px] text-white transition-transform duration-300 ease-out"
          >
            TAG
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen md:p-16 p-8 text-center">
        {/* Spacer for fixed title */}
        <div className="md:h-[200px] h-[130px]"></div>

        {/* Description */}
        <div className="mb-16 max-w-4xl">
          <p 
            className="description-text text-white text-lg md:text-xl leading-relaxed transition-all duration-300"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            Formaciones en interpretación para cine y teatro, diseñadas para desarrollar técnica, actitud y autenticidad. Aprende, crece y lleva tu interpretación al siguiente nivel.
          </p>
        </div>

        {/* Trimestral Courses Cards */}
        <TrimestralCards />

        {/* Courses List */}
        <div className="w-full max-w-2xl mt-24">
          {coursesData.map((course, index) => (
            <div key={index} className="mb-2">
              <div 
                ref={(el) => { coursesRef.current[index] = el; }}
                className="flex items-center justify-between py-6 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => toggleCourse(index)}
              >
                <h3 className="text-white text-2xl md:text-2xl font-semibold uppercase text-left">
                  {course.title}
                </h3>
                <span className="text-white text-2xl">
                  {expandedCourse === index ? '×' : '+'}
                </span>
              </div>

              {/* Expanded Content */}
              {expandedCourse === index && (
                <div className="text-left mb-8 animate-fadeIn">
                  <h2 className="text-white md:text-8xl text-8xl font-druk mb-6">
                    {course.title}
                  </h2>
                  <p className="text-white text-lg leading-relaxed mb-8">
                    {course.description}
                  </p>
                  <div className="space-y-2 text-white mb-6">
                    <p><strong>Duración total:</strong> {course.duracion}</p>
                    <p><strong>Días por semana:</strong> {course.diasSemana}</p>
                    <p><strong>Carga horaria semanal:</strong> {course.cargaHoraria}</p>
                    <p><strong>Edades:</strong> {course.edades}</p>
                    <p><strong>Modalidad:</strong> {course.modalidad}</p>
                    <p><strong>Objetivo:</strong> {course.objetivo}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoreInfo(course.title);
                    }}
                    className="px-8 py-3 bg-tag-yellow text-black font-bold text-lg uppercase transition-all duration-300 hover:bg-white hover:-translate-y-0.5"
                  >
                    QUIERO MÁS INFORMACIÓN
                  </button>
                </div>
              )}

              {/* Animated line below each course */}
              <div 
                ref={(el) => { linesRef.current[index] = el; }}
                className="h-px bg-white transition-all duration-1000 ease-out"
                style={{ width: '0%' }}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Testimonios Section */}
      <Testimonios />
    </div>
    </>
  );
};

export default Cursos;