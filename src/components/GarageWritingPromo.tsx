import React from 'react';
import { Link } from 'react-router-dom';

const GarageWritingPromo: React.FC = () => {
  return (
    <div className="w-full bg-black px-4 md:px-6 py-10 md:py-14">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center gap-6 md:gap-10 border-l-4 border-tag-yellow pl-5 md:pl-8">
        <div className="flex-1">
          <span className="inline-block text-tag-yellow text-xs font-bold uppercase tracking-widest mb-3">
            Nuevo · Cursos online
          </span>
          <h3 className="font-druk text-3xl md:text-4xl text-white uppercase leading-tight mb-3">
            Garage Writing
          </h3>
          <p className="font-garamond text-white/70 text-base md:text-lg leading-relaxed mb-2">
            La nueva formación online de TAG dedicada a la escritura dramática y el guion
            cinematográfico. Doce sesiones en directo vía Zoom, con los mejores profesionales
            del oficio — sales con material propio, no con apuntes.
          </p>
          <p className="font-garamond text-white/50 text-sm md:text-base">
            Empezamos con <strong className="text-white">Escribir Comedia</strong>, con Yago
            Alonso · 16 sep – 2 dic
          </p>
        </div>
        <Link
          to="/cursos/garage-writing"
          className="shrink-0 inline-block bg-tag-yellow text-black uppercase font-bold text-xs tracking-widest px-8 py-4 text-center hover:bg-white transition-colors"
        >
          Quiero más información →
        </Link>
      </div>
    </div>
  );
};

export default GarageWritingPromo;
