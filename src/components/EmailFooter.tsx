import React from 'react';
import { useFormFlyout } from '../context/FormFlyoutContext';

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
        
        <p className="m-0 font-sans text-sm text-black text-center leading-relaxed antialiased">
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
              
              <p className="m-0 font-sans text-sm text-[#e8e4da] leading-normal text-center antialiased">
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
                <div className="w-[120px] h-[120px] rounded-full overflow-hidden mx-auto mb-4 border-3 border-[#f4b03e]">
                  <img 
                    src="https://mcusercontent.com/449da8926588f125f8a1cb1a7/images/bbf2c804-6ae5-2cfa-97b4-a23ede914cf6.jpg" 
                    alt="Tony Corvillo" 
                    className="w-[120px] h-[120px] block object-cover"
                  />
                </div>
                <h2 className="m-0 font-druk text-lg font-medium text-tag-yellow uppercase tracking-tight text-center antialiased">
                  Tony Corvillo
                </h2>
              </div>

              {/* Founder 2 */}
              <div className="text-center flex-1 min-w-[200px]">
                <div className="w-[120px] h-[120px] rounded-full overflow-hidden mx-auto mb-4 border-3 border-[#f4b03e]">
                  <img 
                    src="https://mcusercontent.com/449da8926588f125f8a1cb1a7/images/032d3a3c-f6ba-a826-ed37-339fbc96e935.jpg" 
                    alt="Andrés Vicente" 
                    className="w-[120px] h-[120px] block object-cover"
                  />
                </div>
                <h2 className="m-0 font-druk text-lg font-medium text-tag-yellow uppercase tracking-tight text-center antialiased">
                  Andrés Vicente
                </h2>
              </div>
            </div>

            {/* Footer Info */}
            <div className="flex flex-col items-center gap-5">
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="h-20 rounded-full flex items-end justify-end">
                  <img 
                    src="https://mcusercontent.com/449da8926588f125f8a1cb1a7/images/4c56683f-7143-90ec-7562-3987b221a970.png" 
                    alt="TAG Badge" 
                    className="w-[100px] h-[100px] block rounded-full"
                  />
                </div>
                <p className="m-0 font-druk text-lg font-medium text-[#f4b03e] uppercase tracking-tight text-center leading-tight antialiased">
                  BUILT TO TRANSFORM<br />
                  BOLD PERFORMANCES
                </p>
              </div>

              <div className="pb-5 text-center">
                <p className="m-0 font-sans text-xs text-[#e8e4da] leading-normal antialiased">
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
