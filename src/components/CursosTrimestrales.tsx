import React from 'react';
import { useFormFlyout } from '../context/FormFlyoutContext';

/*
 * Garage Trimestrales — cursos de un trimestre (enero–abril 2027). Se muestran dentro de la
 * ficha "Garage Trimestrales" en /cursos. Los datos salen de las fichas que pasó la escuela;
 * `curso` es el nombre que llega al CRM y tiene que existir en COURSES de FormFlyout.
 */
interface Horario {
  dia: string;
  fechas: string;
  clases: string[];
}

interface Trimestral {
  curso: string;
  titulo: string;
  subtitulo?: string;
  descripcion: string;
  foto: string;
  ficha: string;
  horarios: Horario[];
}

export const TRIMESTRALES: Trimestral[] = [
  {
    curso: 'Garage Hybrid Nivel I',
    titulo: 'Hybrid Nivel I',
    subtitulo: 'Cámara y teatro',
    descripcion:
      'Descubre las bases de la interpretación combinando el lenguaje teatral y audiovisual. Trabaja la expresión corporal, la voz, la creación de personajes y la interpretación frente a cámara desde la práctica.',
    foto: '/content/trimestrales/hybrid-nivel-1.jpg',
    ficha: '/content/trimestrales/hybrid-nivel-1-ficha.jpg',
    horarios: [
      { dia: 'Lunes', fechas: '11 de enero al 5 de abril', clases: ['18 a 20 h · Cámara I', '20 a 22 h · Teatro I'] },
      { dia: 'Martes', fechas: '12 de enero al 30 de marzo', clases: ['10 a 12 h · Cámara I', '12 a 14 h · Teatro I'] },
    ],
  },
  {
    curso: 'Garage Hybrid Nivel II',
    titulo: 'Hybrid Nivel II',
    subtitulo: 'Cámara y teatro',
    descripcion:
      'Profundiza en tu técnica interpretativa y desarrolla personajes y escenas de mayor complejidad. Un entrenamiento para ampliar tus recursos expresivos y ganar seguridad tanto en el escenario como frente a cámara.',
    foto: '/content/trimestrales/hybrid-nivel-2.jpg',
    ficha: '/content/trimestrales/hybrid-nivel-2-ficha.jpg',
    horarios: [
      { dia: 'Viernes', fechas: '15 de enero al 9 de abril', clases: ['18 a 20 h · Cámara II', '20 a 22 h · Teatro II'] },
    ],
  },
  {
    curso: 'Garage On Camera',
    titulo: 'Garage On Camera',
    subtitulo: 'En inglés',
    descripcion:
      'Entrena tu interpretación frente a cámara en inglés, trabajando escenas, personajes y herramientas del lenguaje audiovisual. Desarrolla tu naturalidad, escucha y confianza actuando en otro idioma.',
    foto: '/content/trimestrales/on-camera-ingles.jpg',
    ficha: '/content/trimestrales/on-camera-ingles-ficha.jpg',
    horarios: [{ dia: 'Viernes', fechas: '15 de enero al 9 de abril', clases: ['16 a 18 h'] }],
  },
  {
    curso: 'Garage Dirección de Escena',
    titulo: 'Dirección de escena',
    descripcion:
      'Explora las herramientas de la dirección escénica, desde el análisis del texto hasta la construcción de una puesta en escena. Aprende a desarrollar una mirada propia y a trabajar con actores para transformar una idea en acción teatral.',
    foto: '/content/trimestrales/direccion-de-escena.jpg',
    ficha: '/content/trimestrales/direccion-de-escena-ficha.jpg',
    horarios: [{ dia: 'Jueves', fechas: '14 de enero al 8 de abril', clases: ['10 a 14 h'] }],
  },
];

const CursosTrimestrales: React.FC = () => {
  const { openFlyout } = useFormFlyout();

  return (
    <div className="text-left">
      <span className="text-tag-yellow text-[11px] uppercase tracking-widest font-druk block mb-6">
        Enero – abril 2027
      </span>

      <div className="space-y-14">
        {TRIMESTRALES.map((t) => (
          <div key={t.curso} className="pt-10 border-t border-white/10 first:pt-0 first:border-t-0">
            <img
              src={t.foto}
              alt={t.titulo}
              className="w-full h-auto block mb-6"
              loading="lazy"
            />
            <h3
              className="font-druk text-white uppercase leading-none mb-2"
              style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}
            >
              {t.titulo}
            </h3>
            {t.subtitulo && (
              <p className="text-tag-yellow/80 font-garamond text-xl italic mb-5">{t.subtitulo}</p>
            )}

            <p className="text-white/70 font-garamond text-xl leading-relaxed mb-6">{t.descripcion}</p>

            <div className="space-y-4 mb-8">
              {t.horarios.map((h) => (
                <div key={h.dia}>
                  <p className="text-white font-druk uppercase text-xl leading-tight">
                    {h.dia}: <span className="text-white/80">{h.fechas}</span>
                  </p>
                  {h.clases.map((c) => (
                    <p key={c} className="text-white/60 text-base font-mdio">{c}</p>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openFlyout(t.curso);
                }}
                className="px-8 py-3 bg-tag-yellow text-black font-bold text-lg uppercase transition-all duration-300 hover:bg-white"
              >
                QUIERO MÁS INFORMACIÓN
              </button>
              <a
                href={t.ficha}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center px-8 py-3 border border-white/40 text-white font-bold text-lg uppercase transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
              >
                VER FICHA
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CursosTrimestrales;
