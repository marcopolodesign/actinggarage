import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';

// Course details data structure
interface CourseDetails {
  title: string;
  description: string;
  duracion: string;
  diasSemana: string;
  cargaHoraria: string;
  edades: string;
  modalidad: string;
  objetivo: string;
}

// Full course data
const coursesDetailsData: CourseDetails[] = [
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
    cargaHoraria: '2 horas',
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
  // State to track expanded courses
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  // Helper function to find course details by name
  const getCourseDetails = (courseName: string): CourseDetails | undefined => {
    // Normalize the course name for matching
    const normalizedSearchName = courseName.toUpperCase().replace(/\s+/g, ' ').trim();
    
    return coursesDetailsData.find(course => {
      const normalizedCourseName = course.title.toUpperCase().replace(/\s+/g, ' ').trim();
      return normalizedCourseName === normalizedSearchName;
    });
  };

  // Toggle course expansion
  const toggleCourse = (courseName: string) => {
    setExpandedCourse(expandedCourse === courseName ? null : courseName);
  };

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
      cursoName: 'GARAGE THEATRE',
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
                className="md:text-lg text-base md:max-w-2xl leading-relaxed md:mb-24 mb-6 tracking-tightest md:tracking-normal"
                style={{ color: curso.textColor }}
              >
                {curso.description}
              </p>
            </div>
            
            {/* Right Side - Button */}
            <Link 
              to="/cursos"
              className="md:px-8 px-4 md:py-4 py-2 border uppercase font-semibold text-sm transition-all duration-300 rounded-full whitespace-nowrap tracking-tightest md:tracking-normal"
              style={{ 
                borderColor: curso.buttonBorderColor || curso.textColor,
                backgroundColor: 'transparent',
                color: curso.buttonTextColor || curso.textColor
              }}
            >
              {curso.buttonText}
            </Link>
          </div>
          
          {/* Bottom Section - Courses */}
          <div className="relative z-10 hidden md:block">
            {curso.courses ? (
              // Render courses in two columns
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 COURSE-trigger">
                  {curso.courses.map((course, index) => {
                    const courseDetails = getCourseDetails(course);
                    const isExpanded = expandedCourse === course;
                    
                    return (
                      <React.Fragment key={index}>
                        {/* Course title row */}
                        <div className='flex flex-col gap-4'>
                          <div 
                            className="flex items-center cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={() => toggleCourse(course)}
                          >
                            <h3 
                              className="md:text-lg text-base uppercase tracking-tightest md:tracking-normal"
                              style={{ color: curso.textColor }}
                            >
                              {course}
                            </h3>
                            <span 
                              className="ml-4 md:text-lg text-base tracking-tightest md:tracking-normal"
                              style={{ color: curso.textColor }}
                            >
                              {isExpanded ? '×' : '+'}
                            </span>
                          </div>

                          <AnimatedLine 
                            className="w-full"
                            style={{ backgroundColor: curso.textColor }}
                          />
                        </div>

                        {/* Expanded Content - spans 2 columns */}
                        {isExpanded && courseDetails && (
                          <div className="col-span-2 text-left mb-4 mt-4 animate-fadeIn">
                            <h2 
                              className="text-6xl font-druk mb-4"
                              style={{ color: curso.textColor }}
                            >
                              {courseDetails.title}
                            </h2>
                            <p 
                              className="text-base leading-relaxed mb-6"
                              style={{ color: curso.textColor }}
                            >
                              {courseDetails.description}
                            </p>
                            <div className="space-y-2" style={{ color: curso.textColor }}>
                              <p><strong>Duración total:</strong> {courseDetails.duracion}</p>
                              <p><strong>Días por semana:</strong> {courseDetails.diasSemana}</p>
                              <p><strong>Carga horaria semanal:</strong> {courseDetails.cargaHoraria}</p>
                              <p><strong>Edades:</strong> {courseDetails.edades}</p>
                              <p><strong>Modalidad:</strong> {courseDetails.modalidad}</p>
                              <p><strong>Objetivo:</strong> {courseDetails.objetivo}</p>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Single cursoName with expandable behavior
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-4 COURSE-trigger">
                  {curso.cursoName && (() => {
                    const courseDetails = getCourseDetails(curso.cursoName);
                    const isExpanded = expandedCourse === curso.cursoName;
                    
                    return (
                      <React.Fragment>
                        {/* Course title row */}
                        <div className='flex flex-col gap-4'>
                          <div 
                            className="flex items-center cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={() => toggleCourse(curso.cursoName)}
                          >
                            <h3 
                              className="md:text-lg text-base uppercase tracking-tightest md:tracking-normal"
                              style={{ color: curso.textColor }}
                            >
                              {curso.cursoName}
                            </h3>
                            <span 
                              className="ml-4 md:text-lg text-base tracking-tightest md:tracking-normal"
                              style={{ color: curso.textColor }}
                            >
                              {isExpanded ? '×' : '+'}
                            </span>
                          </div>

                          <AnimatedLine 
                            className="w-full"
                            style={{ backgroundColor: curso.textColor }}
                          />
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && courseDetails && (
                          <div className="text-left mb-4 mt-4 animate-fadeIn">
                            <h2 
                              className="text-6xl font-druk mb-4"
                              style={{ color: curso.textColor }}
                            >
                              {courseDetails.title}
                            </h2>
                            <p 
                              className="text-base leading-relaxed mb-6"
                              style={{ color: curso.textColor }}
                            >
                              {courseDetails.description}
                            </p>
                            <div className="space-y-2" style={{ color: curso.textColor }}>
                              <p><strong>Duración total:</strong> {courseDetails.duracion}</p>
                              <p><strong>Días por semana:</strong> {courseDetails.diasSemana}</p>
                              <p><strong>Carga horaria semanal:</strong> {courseDetails.cargaHoraria}</p>
                              <p><strong>Edades:</strong> {courseDetails.edades}</p>
                              <p><strong>Modalidad:</strong> {courseDetails.modalidad}</p>
                              <p><strong>Objetivo:</strong> {courseDetails.objetivo}</p>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CursosHome;
