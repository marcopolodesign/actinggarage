import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import LogoMin from '../assets/LogoMin';
import { useFormFlyout } from '../context/FormFlyoutContext';
import { useAboutFlyout } from '../context/AboutFlyoutContext';
import { buildCampaignWhatsAppUrl } from '../utils/utm';
import { trackWhatsappClick } from '../utils/trackWhatsapp';

/**
 * Header de la home nueva — navegación por ETAPA DE DECISIÓN, no por tipo de página.
 *
 * El informe de LFS lo marcaba como el punto 9 del embudo: «Study at LFS» agrupa
 * Cómo aplicar · Instalaciones · Financiación · Habla con un alumno · Fechas clave,
 * que es el recorrido mental del que está decidiendo. TAG tenía Inicio · About ·
 * Cursos · Contacto, ordenado por tipo de página.
 *
 * Gestos que vienen de LFS y respetan el design system de TAG:
 *  - el logotipo completo se reduce a su marca al scrollear
 *  - un solo signo de acción, la flecha →, repetido en todos los bloques
 *  - botones cuadrados, sin radio, amarillo pleno sobre negro
 */

const INSTAGRAM_URL = 'https://www.instagram.com/theactinggarage/';

type SubItem = { label: string; hash: string };

// «Estudiar en TAG» — el bloque que faltaba. Es el recorrido del que decide.
const ESTUDIAR: SubItem[] = [
  { label: 'Cómo se entra', hash: '#inscripciones' },
  { label: 'Fechas clave', hash: '#fechas' },
  { label: 'La escuela', hash: '#escuela' },
  { label: 'Qué incluye', hash: '#incluye' },
  { label: 'Preguntas frecuentes', hash: '#faq' },
];

const HeaderNueva: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openEstudiar, setOpenEstudiar] = useState(false);
  const { openFlyout } = useFormFlyout();
  const { openFlyout: openAboutFlyout } = useAboutFlyout();

  const whatsappUrl = useMemo(
    () =>
      buildCampaignWhatsAppUrl(
        'Hola! Quiero más información sobre los cursos de la escuela',
        'Hola TAG! Quiero más info sobre sus cursos!',
        // Meta pago: el texto arranca con "Quisiera" — es la señal de origen que
        // usa Florencia en el CRM (ver CAMPAIGNS.md). No tocar.
        'Hola TAG! Quisiera más info sobre sus cursos!'
      ),
    []
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Con el menú mobile abierto no se scrollea el fondo.
  useEffect(() => {
    document.body.style.overflow = openMenu ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openMenu]);

  const go = (hash: string) => {
    setOpenMenu(false);
    setOpenEstudiar(false);
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const linkClass =
    'text-white text-xs uppercase tracking-[0.14em] hover:text-tag-yellow transition-colors duration-300';

  return (
    <div data-tag-nueva>
      {/* La barra de convocatoria y el header van en un mismo contenedor fijo: apilados,
          sin offsets a ojo. En mobile la barra envolvía a dos líneas y se comía el logo. */}
      <div className="fixed top-0 left-0 right-0 z-50">
      {/* Barra de convocatoria — la fecha de inicio vive arriba de todo, no en la ficha */}
      <div className="bg-tag-yellow text-black">
        <button
          onClick={() => go('#inscripciones')}
          className="w-full flex items-center justify-center gap-2 md:gap-3 px-4 py-2 text-[10px] md:text-xs uppercase tracking-[0.12em] md:tracking-[0.16em] font-bold hover:bg-white transition-colors duration-300"
        >
          <span className="md:hidden">Convocatoria abierta · Empieza el 14 sep</span>
          <span className="hidden md:inline">
            Convocatoria abierta · Curso 2026/27 · Empieza el 14 de septiembre
          </span>
          <span aria-hidden="true">&#8594;</span>
        </button>
      </div>

      <header className="bg-black border-b border-white/10">
        <div className="flex items-center justify-between px-5 md:px-8 py-3">
          {/* El logotipo completo se reduce a su marca al scrollear */}
          <Link to="/" aria-label="The Acting Garage" className="flex items-center">
            <span
              className="block transition-all duration-500"
              style={{ width: scrolled ? 64 : 150 }}
            >
              <LogoMin />
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/cursos" className={linkClass}>
              Cursos
            </Link>

            {/* Estudiar en TAG — agrupado por lo que el visitante necesita saber */}
            <div
              className="relative"
              onMouseEnter={() => setOpenEstudiar(true)}
              onMouseLeave={() => setOpenEstudiar(false)}
            >
              <button className={`${linkClass} flex items-center gap-2`}>
                Estudiar en TAG
                <span aria-hidden="true" className="text-[9px]">&#9660;</span>
              </button>
              {openEstudiar && (
                <div className="absolute left-0 top-full pt-4">
                  <div className="bg-tag-yellow min-w-[260px]">
                    {ESTUDIAR.map((s) => (
                      <button
                        key={s.hash}
                        onClick={() => go(s.hash)}
                        className="w-full text-left px-5 py-3 text-black text-xs uppercase tracking-[0.12em] font-bold border-b border-black/10 last:border-0 hover:bg-black hover:text-tag-yellow transition-colors duration-200 flex items-center justify-between gap-6"
                      >
                        {s.label}
                        <span aria-hidden="true">&#8594;</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/calendario" className={linkClass}>
              Calendario
            </Link>

            <button onClick={(e) => { e.preventDefault(); openAboutFlyout(); }} className={linkClass}>
              La escuela
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsappClick('header')}
              className={linkClass}
            >
              WhatsApp
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de The Acting Garage"
              className="text-white hover:text-tag-yellow transition-colors duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2" />
                <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" />
              </svg>
            </a>

            <button
              onClick={() => openFlyout()}
              className="bg-tag-yellow text-black px-5 py-3 text-xs uppercase tracking-[0.12em] font-bold hover:bg-white transition-colors duration-300 flex items-center gap-2"
            >
              Pedir plaza
              <span aria-hidden="true">&#8594;</span>
            </button>
          </nav>

          <button
            onClick={() => setOpenMenu((v) => !v)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            aria-label="Abrir menú"
            aria-expanded={openMenu}
          >
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${openMenu ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${openMenu ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${openMenu ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>
      </div>

      {/* Menú mobile — mismo orden por etapa de decisión */}
      <div
        className={`fixed inset-0 z-40 bg-tag-yellow overflow-y-auto transition-transform duration-300 md:hidden ${
          openMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col pt-28 pb-16 px-6">
          <Link
            to="/cursos"
            onClick={() => setOpenMenu(false)}
            className="font-druk text-black text-4xl uppercase py-3"
          >
            Cursos
          </Link>

          <span className="text-black/50 text-[10px] uppercase tracking-[0.2em] font-bold mt-8 mb-2">
            Estudiar en TAG
          </span>
          {ESTUDIAR.map((s) => (
            <button
              key={s.hash}
              onClick={() => go(s.hash)}
              className="text-left font-druk text-black text-2xl uppercase py-2 flex items-center justify-between"
            >
              {s.label}
              <span aria-hidden="true">&#8594;</span>
            </button>
          ))}

          <Link
            to="/calendario"
            onClick={() => setOpenMenu(false)}
            className="font-druk text-black text-4xl uppercase py-3 mt-8"
          >
            Calendario
          </Link>
          <button
            onClick={() => {
              setOpenMenu(false);
              openAboutFlyout();
            }}
            className="text-left font-druk text-black text-4xl uppercase py-3"
          >
            La escuela
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsappClick('header_mobile')}
            className="font-druk text-black text-4xl uppercase py-3"
          >
            WhatsApp
          </a>

          <button
            onClick={() => {
              setOpenMenu(false);
              openFlyout();
            }}
            className="mt-8 bg-black text-tag-yellow px-6 py-5 font-druk text-2xl uppercase flex items-center justify-between"
          >
            Pedir plaza
            <span aria-hidden="true">&#8594;</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default HeaderNueva;
