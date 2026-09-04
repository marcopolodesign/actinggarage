import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Testimonios from '../components/Testimonios';
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
      slug: 'garage-pro',
      title: 'Garage Pro',
      description: 'Formación integral para actores y actrices que buscan profesionalizarse. Entrenamiento completo en interpretación, cámara, cuerpo, voz, movimiento, improvisación, lucha escénica, danza y otras disciplinas esenciales.',
      duracion: '3 años',
      diasSemana: '4',
      cargaHoraria: '16 horas',
      edades: 'Desde 17 años',
      modalidad: 'Teatro + Cine (integral)',
      objetivo: 'Profesionalización actoral',
      categories: ['pro']
    },
    {
      slug: 'garage-theatre',
      title: 'Garage Theatre',
      description: 'Curso de introducción al teatro. Formación práctica y divertida para quienes desean descubrir su potencial expresivo y conectar con su creatividad.',
      duracion: '3 años',
      diasSemana: '1',
      cargaHoraria: '2 horas',
      edades: '17 a 60 años',
      modalidad: 'Teatro',
      objetivo: 'Iniciación y desarrollo personal',
      categories: ['iniciacion', 'pro']
    },
    {
      slug: 'garage-cinema',
      title: 'Garage Cinema',
      description: 'Curso de iniciación en la interpretación frente a cámara. Desde el primer día se trabaja con cámara y ejercicios prácticos para ganar naturalidad y técnica audiovisual.',
      duracion: '3 años',
      diasSemana: '1',
      cargaHoraria: '2 horas',
      edades: '17 a 60 años',
      modalidad: 'Cine',
      objetivo: 'Iniciación actoral y práctica audiovisual',
      categories: ['iniciacion', 'pro']
    },
    {
      slug: 'garage-hybrid',
      title: 'Garage Hybrid',
      description: 'Formación combinada en teatro y cine. Para quienes quieren explorar la interpretación en todas sus vertientes y prepararse para castings o audiciones.',
      duracion: '3 años',
      diasSemana: '2',
      cargaHoraria: '4 horas',
      edades: '17 a 60 años',
      modalidad: 'Teatro + Cine',
      objetivo: 'Profesionalización y preparación para audiciones',
      categories: ['iniciacion', 'pro']
    },
    {
      slug: 'garage-hybrid-plus',
      title: 'Garage Hybrid Plus',
      description: 'Formación integral para quienes buscan profesionalizarse sin la carga del PRO. Entrenamiento en interpretación, cámara, canto y creación.',
      duracion: '3 años',
      diasSemana: '2',
      cargaHoraria: '8 horas',
      edades: '17 a 45 años',
      modalidad: 'Teatro + Cine',
      objetivo: 'Profesionalización actoral adaptable',
      categories: ['pro']
    },
    {
      href: '/jovenes',
      title: 'TAG para Jóvenes',
      description: 'Programas de teatro y actuación para cada etapa: Kids (9-12) y New Generation —teatro, cámara o híbrido— (13-17). Grupos pequeños, profesores en activo.',
      duracion: 'Curso anual',
      diasSemana: 'Según programa',
      cargaHoraria: 'Desde 1h30/semana',
      edades: '9 a 17 años',
      modalidad: 'Teatro / Cine / Híbrido según edad',
      objetivo: 'Formación por etapa de desarrollo',
      categories: ['menores']
    },
    {
      slug: 'garage-kids',
      title: 'Garage Kids',
      description: 'Teatro para niños y niñas de 9 a 12 años. Técnica actoral real adaptada a su edad: presencia escénica, voz, personaje y montaje final.',
      duracion: 'Curso anual',
      diasSemana: 'Según grupo',
      cargaHoraria: '2h/semana',
      edades: '9 a 12 años',
      modalidad: 'Teatro',
      objetivo: 'Identidad, técnica y pensamiento crítico',
      categories: ['menores']
    },
    {
      slug: 'garage-new-generation',
      title: 'Garage New Generation',
      description: 'Teatro para jóvenes de 13 a 17 años, en recorrido de teatro, cámara o híbrido. Del juego a la identidad artística, con bolsa de casting.',
      duracion: 'Curso anual',
      diasSemana: 'Según grupo',
      cargaHoraria: '2h/semana',
      edades: '13 a 17 años',
      modalidad: 'Teatro / Cine / Híbrido',
      objetivo: 'Identidad artística y presencia escénica',
      categories: ['menores']
    },
    {
      title: 'Garage Evolution',
      description: 'Entrenamiento avanzado para egresados TAG. Programas personalizados para seguir desarrollando técnica, creatividad y autoconocimiento actoral.',
      duracion: 'Continua / anual',
      diasSemana: 'Variable',
      cargaHoraria: 'Personalizada',
      edades: 'Desde 17 años',
      modalidad: 'Entrenamiento personalizado',
      objetivo: 'Perfeccionamiento actoral',
      categories: ['pro']
    },
    {
      slug: 'garage-classic',
      title: 'Garage Classic',
      description: 'Teatro para mayores de 60. Propuesta de aprendizaje y disfrute a través del teatro, fomentando la memoria, expresión y motricidad.',
      duracion: 'Curso anual',
      diasSemana: '1',
      cargaHoraria: '1 hora y media',
      edades: '60+',
      modalidad: 'Teatro',
      objetivo: 'Bienestar, diversión y desarrollo cognitivo',
      categories: ['iniciacion']
    },
    {
      slug: 'garage-expert-cinema',
      title: 'Garage Expert Cinema',
      description: 'El curso para actores avanzados. Un año para llevar tus herramientas a maestría y salir con un videobook profesional: 3 a 5 escenas rodadas, headshots y self-tape, listo para agentes y castings.',
      duracion: 'Curso anual (sep–jun)',
      diasSemana: '2',
      cargaHoraria: '4 horas',
      edades: 'Actores avanzados',
      modalidad: 'Escena + Cámara + Industria',
      objetivo: 'Salida al mercado con material profesional',
      categories: ['pro']
    },
    {
      slug: 'garage-writing',
      title: 'Garage Writing',
      description: 'Escribir comedia, de la premisa al escenario. 12 sesiones online con Yago Alonso para llevar una idea cómica hasta una pieza teatral: estructura, personajes, diálogos y mecanismos cómicos.',
      duracion: '12 sesiones',
      diasSemana: '1',
      cargaHoraria: '3 horas',
      edades: 'Interés en escritura dramática',
      modalidad: 'Online vía Zoom',
      objetivo: 'Escribir una comedia teatral propia',
      categories: ['iniciacion', 'pro']
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

  const CATEGORY_INFO: Record<string, { label: string; href: string }> = {
    iniciacion: { label: 'Iniciación', href: '/iniciacion' },
    pro: { label: 'Pro', href: '/pro' },
    menores: { label: 'Menores', href: '/jovenes' },
  };

  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const { openFlyout } = useFormFlyout();

  const FILTERS: { key: string; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'iniciacion', label: 'Iniciación' },
    { key: 'pro', label: 'Pro' },
    { key: 'menores', label: 'Menores' },
  ];

  const matchesFilter = (course: { categories?: string[] }) =>
    activeFilter === 'todos' || (course.categories ?? []).includes(activeFilter);

  const visibleCount = coursesData.filter(matchesFilter).length;

  const selectFilter = (key: string) => {
    setActiveFilter(key);
    // Si el curso abierto queda fuera del filtro, el acordeón se quedaría expandido
    // sin ser visible y al volver a "Todos" aparecería abierto sin motivo.
    setExpandedCourse(null);
  };

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
      <meta property="og:url" content="https://www.theactinggarage.com/cursos" />
      
      {/* Twitter */}
      <meta name="twitter:title" content="Cursos de Interpretación - The Acting Garage" />
      <meta name="twitter:description" content="Descubre nuestros cursos de interpretación para cine y teatro. Formación profesional para todas las edades." />
      
      {/* LLM Tags */}
      <meta name="ai:title" content="Cursos de Interpretación - The Acting Garage" />
      <meta name="ai:description" content="Cursos profesionales de interpretación: GARAGE PRO (formación integral 16h/semana), GARAGE THEATRE (iniciación teatro 2h/semana), GARAGE CINEMA (interpretación cámara 2h/semana), GARAGE HYBRID (teatro+cine 4h/semana), GARAGE KIDS (8-12 años), GARAGE NEW GENERATION (13-17 años), GARAGE CLASSIC (60+), y más." />
      
      {/* Canonical */}
      <link rel="canonical" href="https://www.theactinggarage.com/cursos" />
    </Helmet>
    
    {/* Header - always visible on Cursos page */}
    <Header showOnScroll={false} />
    
    <div className="min-h-screen relative pt-20">
      {/* Background Image */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 z-0 h-screen"
        style={{
          backgroundImage: 'url(/content/cursos-header.jpg)',
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
        {/* h1 real de la página: es el titular que ya se veía, sólo cambia la etiqueta.
            La página no tenía ningún h1 y el h2 de más abajo es por curso, dentro del
            acordeón, así que se repetía. */}
        <h1 className="flex gap-8 items-center m-0 font-normal">
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
        </h1>
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

        {/* Cursos de verano (TrimestralCards) ocultos 2026-07-31 — terminaron el 30 jul */}

        {/* Filtros por categoría. Los cursos que no matchean se ocultan por CSS en vez de
            sacarse del array: los refs de las animaciones de scroll son por índice, así que
            filtrar el array los desalinearía. De paso el contenido sigue en el HTML. */}
        <div className="w-full max-w-2xl mt-20">
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const active = activeFilter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => selectFilter(f.key)}
                  aria-pressed={active}
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                  className={`text-lg md:text-xl px-5 py-2.5 border transition-colors duration-200 ${
                    active
                      ? 'bg-white text-black border-white'
                      : 'text-white border-white/30 hover:border-white'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
            <span
              className="text-white/40 text-base md:text-lg ml-3"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              {visibleCount} {visibleCount === 1 ? 'curso' : 'cursos'}
            </span>
          </div>
        </div>

        {/* Courses List */}
        <div className="w-full max-w-2xl mt-8">
          {coursesData.map((course, index) => (
            <div key={index} className={`mb-2 ${matchesFilter(course) ? '' : 'hidden'}`}>
              <div
                ref={(el) => { coursesRef.current[index] = el; }}
                className="flex items-center justify-between py-6 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => toggleCourse(index)}
              >
                <div>
                  {course.categories && course.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {course.categories.map((cat) => {
                        const info = CATEGORY_INFO[cat];
                        if (!info) return null;
                        return (
                          <Link
                            key={cat}
                            to={info.href}
                            onClick={(e) => e.stopPropagation()}
                            className="text-tag-yellow/70 text-[10px] uppercase tracking-widest font-druk border border-tag-yellow/30 px-2 py-0.5 hover:bg-tag-yellow hover:text-black hover:border-tag-yellow transition-colors duration-200"
                          >
                            {info.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                  <h3 className="text-white text-2xl md:text-2xl font-semibold uppercase text-left">
                    {course.title}
                  </h3>
                </div>
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

                  {(course.slug || course.href) && (
                    <Link
                      to={course.href || `/cursos/${course.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="ml-4 inline-flex items-center justify-center px-8 py-3 border border-white/40 text-white font-bold text-lg uppercase transition-all duration-300 hover:border-white hover:bg-white hover:text-black hover:-translate-y-0.5"
                    >
                      VER DETALLES
                    </Link>
                  )}
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