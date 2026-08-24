import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Se retira sola después de que arranca el curso (16 sep 2026) — evita
// promocionar "empezamos el 16 sep" una vez que ya empezó.
const PROMO_CUTOFF = new Date('2026-09-16T00:00:00');
const DISMISS_KEY = 'tag_gw_corner_dismissed';

const GarageWritingCorner: React.FC = () => {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (new Date() >= PROMO_CUTOFF) return;
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') return;
    } catch {
      // localStorage no disponible (privacidad/incógnito) — mostrar igual
    }
    setDismissed(false);
  }, []);

  const handleClose = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // no-op
    }
  };

  if (dismissed) return null;

  return (
    <div className="fixed bottom-24 md:bottom-28 right-5 md:right-8 z-40 w-[200px] md:w-[220px]">
      <div className="relative">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar"
          className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-7 h-7 rounded-full bg-black border-2 border-tag-yellow text-tag-yellow flex items-center justify-center text-sm font-bold z-10 hover:bg-tag-yellow hover:text-black transition-colors"
        >
          ×
        </button>

        <div className="border-2 border-black rounded-2xl overflow-hidden shadow-xl">
        <Link to="/cursos/garage-writing" className="block">
          <img
            src="/content/tag-bg.jpg"
            alt="Garage Writing"
            className="w-full h-[130px] object-cover"
          />
          <div className="bg-tag-yellow px-3 py-3">
            <p className="font-druk text-black text-sm leading-tight uppercase">
              Garage Writing: escribe tu comedia con Yago Alonso.
            </p>
            <p className="font-druk text-black text-sm leading-tight uppercase mt-1">
              Empieza el 16 de septiembre.
            </p>
          </div>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default GarageWritingCorner;
