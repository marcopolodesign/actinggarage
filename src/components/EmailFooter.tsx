import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormFlyout } from '../context/FormFlyoutContext';

/**
 * Retrato de un fundador en el pie.
 *
 * Las tres imágenes de este bloque estaban enganchadas al CDN de Mailchimp
 * (`mcusercontent.com`), que desde hace semanas responde **403 Access Denied**
 * a cualquier petición — con o sin cabeceras de navegador. O sea que todo el
 * que entraba al sitio veía tres imágenes rotas en el pie, en todas las páginas.
 *
 * Dos cambios para que no vuelva a pasar:
 *
 * 1. La foto se sirve **desde el propio sitio** (`/content/…`). Nunca desde un
 *    tercero: si el tercero corta el acceso, se cae la web y nadie se entera.
 * 2. Si el archivo no está, no se muestra una imagen rota: se pintan las
 *    iniciales sobre el aro amarillo, que es una pieza válida del sistema
 *    (tipografía pesada + amarillo sobre negro) y se lee como intencional.
 *
 * Para poner las fotos reales basta con dejar los archivos en
 * `public/content/` con estos nombres. No hace falta tocar código.
 */
const FounderAvatar: React.FC<{ src: string; name: string; initials: string }> = ({
  src,
  name,
  initials,
}) => {
  const [falló, setFalló] = useState(false);

  return (
    <div className="w-[120px] h-[120px] rounded-full overflow-hidden mx-auto mb-4 border-3 border-[#f4b03e] flex items-center justify-center bg-black">
      {falló ? (
        <span
          aria-hidden="true"
          className="font-druk text-4xl text-tag-yellow uppercase tracking-tight antialiased"
        >
          {initials}
        </span>
      ) : (
        <img
          src={src}
          alt={name}
          onError={() => setFalló(true)}
          className="w-[120px] h-[120px] block object-cover"
        />
      )}
    </div>
  );
};

const EmailFooter: React.FC = () => {
  const { openFlyout } = useFormFlyout();

  return (
    <div className="font-sans antialiased">
      {/* Main Content Section */}
      <div className="bg-tag-yellow py-12 px-10 text-center">
        <h3 className="m-0 mb-1 font-druk text-6xl font-medium text-black uppercase tracking-tight leading-tight text-center antialiased">
          TAG YOUR JOURNEY
        </h3>
        
        <h4 className="m-0 mb-1 font-druk text-6xl font-medium text-black uppercase tracking-tight leading-tight text-center antialiased">
          ACTUACIÓN SIN FILTROS.
        </h4>
        
        <h4 className="m-0 mb-6 font-druk text-6xl font-medium text-black uppercase tracking-tight leading-tight text-center antialiased">
          SIN MIEDOS NI LÍMITES.
        </h4>
        
        <p className="m-0 font-sans text-base text-black text-center leading-relaxed antialiased">
          <strong>Cada actriz tiene algo único.</strong><br />
          Nuestro trabajo es ayudarte a <strong>descubrirlo y proyectarlo</strong><br />
          con fuerza, acompañada por profesionales que ya vivieron esa transformación.
        </p>
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-[#1a1a1a] rounded-b-[30px] py-12 px-10">
        {/* Main container with responsive flex */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          
          {/* Left side: CTA + Button */}
          <div className="flex flex-col flex-1">
            {/* CTA Headline */}
            <div className="pb-8">
              <h5 className="m-0 mb-2 font-druk text-3xl font-medium text-tag-yellow uppercase tracking-tight text-center antialiased">
                ¿QUIERES DAR EL PRIMER PASO?
              </h5>
              
              <p className="m-0 font-sans text-base text-[#e8e4da] leading-relaxed text-center antialiased">
                Déjanos tu teléfono para conversar sobre tus objetivos, sueños<br />
                y miedos reales :)
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mx-auto">
              <button 
                onClick={() => openFlyout()}
                className="bg-tag-yellow font-druk text-2xl font-medium text-black no-underline uppercase tracking-tight inline-block antialiased text-center py-5 px-20 rounded-full border-none cursor-pointer hover:opacity-90 transition-opacity"
              >
                ME INTERESA!
              </button>
            </div>
          </div>

          {/* Right side: Founders + Footer Info */}
          <div className="flex flex-col flex-1">
            {/* Founders Section */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center mb-8">
              {/* Founder 1 */}
              <div className="text-center flex-1 min-w-[200px]">
                <FounderAvatar
                  src="/content/tony-corvillo.jpg"
                  name="Tony Corvillo"
                  initials="TC"
                />
                <h2 className="m-0 font-druk text-lg font-medium text-tag-yellow uppercase tracking-tight text-center antialiased">
                  Tony Corvillo
                </h2>
              </div>

              {/* Founder 2 */}
              <div className="text-center flex-1 min-w-[200px]">
                <FounderAvatar
                  src="/content/andres-vicente.jpg"
                  name="Andrés Vicente"
                  initials="AV"
                />
                <h2 className="m-0 font-druk text-lg font-medium text-tag-yellow uppercase tracking-tight text-center antialiased">
                  Andrés Vicente
                </h2>
              </div>
            </div>

            {/* Footer Info */}
            <div className="flex flex-col items-center gap-5">
              
              {/*
                Acá había un "TAG Badge" traído del mismo CDN de Mailchimp, roto
                por el mismo 403. La chapa no dice nada que no diga ya el
                logotipo del encabezado, así que en vez de dejar un hueco o una
                imagen rota, el lema se queda solo y centrado. Si aparece el
                archivo original, se vuelve a poner — servido desde `/content/`,
                no desde un tercero.
              */}
              <div className="flex items-center justify-center">
                <p className="m-0 font-druk text-lg font-medium text-[#f4b03e] uppercase tracking-tight text-center leading-tight antialiased">
                  BUILT TO TRANSFORM<br />
                  BOLD PERFORMANCES
                </p>
              </div>

              <div className="pb-5 text-center">
                <p className="m-0 mb-3 font-sans text-sm text-[#e8e4da] leading-relaxed antialiased">
                  <a
                    href="https://www.instagram.com/theactingarage/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:underline text-[#e8e4da]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2" />
                      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" />
                    </svg>
                    @theactingarage
                  </a>
                </p>
                <p className="m-0 font-sans text-sm text-[#e8e4da] leading-relaxed antialiased">
                  <Link to="/privacidad" className="hover:underline text-[#888]">Política de privacidad</Link>
                  {' · '}
                  <Link to="/terminos" className="hover:underline text-[#888]">Términos y condiciones</Link>
                  <br /></p>
                <p className="m-0 font-sans text-sm text-[#e8e4da] leading-relaxed antialiased">
                  <a
                    href="tel:933398307"
                    className="hover:underline text-[#e8e4da]"
                    style={{ wordBreak: 'break-word' }}
                  >
                    933 398 307
                  </a>
                  <br />
                  <a
                    href="tel:+34682560187"
                    className="hover:underline text-[#e8e4da]"
                    style={{ wordBreak: 'break-word' }}
                  >
                    +34 682 56 01 87
                  </a>
                  <br />
                  <a
                    href="mailto:hola@theactinggarage.com"
                    className="hover:underline text-[#e8e4da]"
                    style={{ wordBreak: 'break-word' }}
                  >
                    hola@theactinggarage.com
                  </a>
                  <br />
                  <a
                    href="https://www.google.com/maps/place/Carrer+de+Londres,+9,+L'Eixample,+08029+Barcelona,+Spain/data=!4m2!3m1!1s0x12a49878613bff27:0xc2d93dd84d4d7877?sa=X&ved=1t:242&ictx=111"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-[#e8e4da]"
                    style={{ wordBreak: 'break-word' }}
                  >
                    Carrer de Londres, 9, Barcelona
                  </a>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailFooter;
