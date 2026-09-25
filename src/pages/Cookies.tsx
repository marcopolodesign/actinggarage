import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { openConsentSettings } from '../lib/consent';

/**
 * Política de cookies. La lista de cookies es la que el sitio usa de verdad
 * (index.html, MetaPixel.tsx, utils/utm.ts, utils/journey.ts). Si se agrega una
 * herramienta nueva, agregarla también acá y en el aviso (CookieConsent.tsx).
 *
 * El texto legal definitivo lo pasa la escuela; esto describe el funcionamiento.
 */

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="font-druk text-xl font-medium text-black uppercase tracking-tight mb-3">{title}</h2>
    <div className="font-sans text-sm text-[#333] leading-relaxed space-y-2">{children}</div>
  </div>
);

const filas: { nombre: string; quien: string; para: string; tipo: string; dura: string }[] = [
  { nombre: 'tag-consent', quien: 'The Acting Garage', para: 'Recordar qué cookies aceptaste o rechazaste', tipo: 'Necesaria', dura: 'Hasta que la borres' },
  { nombre: 'utm_* · referrer_source · session_path', quien: 'The Acting Garage', para: 'Saber por qué anuncio o página llegaste, para atender tu solicitud', tipo: 'Necesaria', dura: 'Sesión / 30 días' },
  { nombre: 'tag_popup_seen', quien: 'The Acting Garage', para: 'No volver a mostrarte el aviso de «¿Quieres saber más?»', tipo: 'Necesaria', dura: 'Hasta que la borres' },
  { nombre: '_ga, _ga_*', quien: 'Google Analytics', para: 'Contar visitas de forma agregada', tipo: 'Analítica', dura: '2 años' },
  { nombre: '_gcl_au, _gcl_aw', quien: 'Google Ads', para: 'Medir si un anuncio de Google terminó en una solicitud', tipo: 'Publicidad', dura: '90 días' },
  { nombre: '_fbp, _fbc', quien: 'Meta (Facebook e Instagram)', para: 'Medir nuestros anuncios en Facebook e Instagram', tipo: 'Publicidad', dura: '90 días' },
];

const Cookies: React.FC = () => (
  <>
    <Helmet>
      <title>Política de Cookies · The Acting Garage</title>
      <meta name="description" content="Qué cookies usa la web de The Acting Garage, para qué sirven y cómo cambiar tu elección." />
      <meta name="robots" content="noindex" />
    </Helmet>

    <Header />

    <main className="bg-[#f4f1ea] min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <p className="font-sans text-xs text-[#888] uppercase tracking-widest mb-2">Legal</p>
          <h1 className="font-druk text-5xl font-medium text-black uppercase tracking-tight leading-tight">
            Política de<br />Cookies
          </h1>
          <p className="font-sans text-sm text-[#666] mt-3">Última actualización: septiembre 2026</p>
        </div>

        <Section title="1. Qué son">
          <p>
            Las cookies son pequeños archivos que la web guarda en tu navegador. Algunas son
            necesarias para que funcione; otras sirven para medir las visitas o los anuncios, y
            ésas sólo se activan si las aceptas.
          </p>
        </Section>

        <Section title="2. Cuáles usamos">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr className="border-b border-black/20">
                  <th className="py-2 pr-3 font-semibold">Cookie</th>
                  <th className="py-2 pr-3 font-semibold">De quién</th>
                  <th className="py-2 pr-3 font-semibold">Para qué</th>
                  <th className="py-2 pr-3 font-semibold">Tipo</th>
                  <th className="py-2 font-semibold">Duración</th>
                </tr>
              </thead>
              <tbody>
                {filas.map(f => (
                  <tr key={f.nombre} className="border-b border-black/10 align-top">
                    <td className="py-2 pr-3 font-mono text-[12px]">{f.nombre}</td>
                    <td className="py-2 pr-3">{f.quien}</td>
                    <td className="py-2 pr-3">{f.para}</td>
                    <td className="py-2 pr-3">{f.tipo}</td>
                    <td className="py-2">{f.dura}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="3. Si las rechazas">
          <p>
            La web funciona igual y puedes escribirnos o inscribirte con normalidad. Google recibe
            sólo avisos anónimos, sin cookies ni identificadores, y el píxel de Meta no se carga.
          </p>
        </Section>

        <Section title="4. Cambiar tu elección">
          <p>Puedes cambiarla cuando quieras:</p>
          <button
            onClick={openConsentSettings}
            className="mt-2 bg-black text-[#FFBE00] px-5 py-3 font-sans text-sm font-bold uppercase tracking-wide hover:bg-[#FFBE00] hover:text-black transition-colors"
          >
            Configurar cookies
          </button>
          <p className="pt-2">
            También puedes borrarlas desde la configuración de tu navegador. Más detalle sobre cómo
            tratamos tus datos en la{' '}
            <Link to="/privacidad" className="underline text-black">política de privacidad</Link>.
          </p>
        </Section>
      </div>
    </main>
  </>
);

export default Cookies;
