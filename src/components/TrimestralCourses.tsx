import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface Course {
  title: string;
  description: string;
  duracion: string;
  diasSemana: string;
  cargaHoraria: string;
  edades: string;
  modalidad: string;
}

const coursesData: Course[] = [
  {
    title: 'Trimestral Teatro I',
    description: 'Curso introductorio al teatro. Aprende los fundamentos de la actuación escénica, expresión corporal y vocal. Ideal para quienes quieren dar sus primeros pasos en el mundo del teatro.',
    duracion: '3 meses',
    diasSemana: '1',
    cargaHoraria: '2 horas',
    edades: 'Desde 17 años',
    modalidad: 'Presencial'
  },
  {
    title: 'Trimestral Teatro II',
    description: 'Nivel avanzado de teatro. Profundiza en técnicas de interpretación, construcción de personajes y presencia escénica. Para quienes ya tienen experiencia en teatro.',
    duracion: '3 meses',
    diasSemana: '1',
    cargaHoraria: '2 horas',
    edades: 'Desde 17 años',
    modalidad: 'Presencial'
  },
  {
    title: 'Trimestral Cámara I',
    description: 'Introducción a la actuación frente a cámara. Aprende técnicas específicas para cine y televisión, naturalidad y trabajo con planos. Perfecto para iniciarse en el mundo audiovisual.',
    duracion: '3 meses',
    diasSemana: '1',
    cargaHoraria: '2 horas',
    edades: 'Desde 17 años',
    modalidad: 'Presencial'
  },
  {
    title: 'Trimestral Cámara II',
    description: 'Nivel avanzado de actuación para cámara. Trabajo intensivo en escenas complejas, monólogos y casting. Para actores con experiencia que buscan profesionalizarse.',
    duracion: '3 meses',
    diasSemana: '1',
    cargaHoraria: '2 horas',
    edades: 'Desde 17 años',
    modalidad: 'Presencial'
  }
];

// Component for animated line
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
            gsap.set(lineRef.current, { 
              width: "0%"
            });
            
            gsap.to(lineRef.current, {
              width: "100%",
              duration: 1.2,
              ease: 'cubic-bezier(0.4, 0, 0, 1)',
              delay: 0.5
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

const TrimestralCourses: React.FC = () => {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const handleCourseClick = (courseTitle: string) => {
    const message = encodeURIComponent(`Hola! Me interesa obtener más información sobre el curso: ${courseTitle}`);
    const whatsappUrl = `https://wa.me/34682560187?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="w-full px-6 sm:px-12 lg:px-24 pt-0 pb-16 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-8">
          {coursesData.map((course, index) => {
            const isExpanded = expandedCourse === course.title;
            
            return (
              <div key={index} className="relative">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between py-4">
                    <h3 
                      className="text-2xl md:text-3xl uppercase text-tag-yellow font-druk cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => handleCourseClick(course.title)}
                    >
                      {course.title}
                    </h3>
                    <span 
                      className="text-tag-yellow text-2xl md:text-3xl cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => setExpandedCourse(isExpanded ? null : course.title)}
                    >
                      {isExpanded ? '×' : '+'}
                    </span>
                  </div>

                  <AnimatedLine 
                    className="w-full"
                    style={{ backgroundColor: '#FFBE00' }}
                  />
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="text-left mb-4 mt-6 animate-fadeIn">
                    <h2 className="text-4xl md:text-6xl font-druk mb-4 text-tag-yellow">
                      {course.title}
                    </h2>
                    <p className="text-lg md:text-xl leading-relaxed mb-6 text-white font-garamond">
                      {course.description}
                    </p>
                    <div className="space-y-2 text-white mb-6 font-garamond">
                      <p><strong>Duración:</strong> {course.duracion}</p>
                      <p><strong>Días por semana:</strong> {course.diasSemana}</p>
                      <p><strong>Carga horaria semanal:</strong> {course.cargaHoraria}</p>
                      <p><strong>Edades:</strong> {course.edades}</p>
                      <p><strong>Modalidad:</strong> {course.modalidad}</p>
                    </div>
                    <button
                      onClick={() => handleCourseClick(course.title)}
                      className="bg-tag-yellow text-black px-8 py-4 font-druk text-lg uppercase hover:bg-white transition-colors duration-300 shadow-lg"
                    >
                      Más información por WhatsApp
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrimestralCourses;

