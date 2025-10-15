import React from 'react';
import { useFormFlyout } from '../context/FormFlyoutContext';

const EmailFooter: React.FC = () => {
  const { openFlyout } = useFormFlyout();

  return (
    <div style={{ 
      fontFamily: 'Helvetica, Arial, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility'
    }}>
      {/* Main Content Section */}
      <div className="bg-tag-yellow" 
      style={{ 
        padding: '50px 40px',
        textAlign: 'center'
      }}>
        <h3 style={{
          margin: '0 0 5px 0',
          fontFamily: 'Druk, Impact, Arial Black, Helvetica Neue, Arial, sans-serif',
          fontSize: '64px',
          fontWeight: '500',
          color: '#1a1a1a',
          textTransform: 'uppercase',
          letterSpacing: '-0.5px',
          lineHeight: '1.1',
          textAlign: 'center',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility'
        }}>
          TAG YOUR JOURNEY
        </h3>
        
        <h4 style={{
          margin: '0 0 5px 0',
          fontFamily: 'Druk, Impact, Arial Black, Helvetica Neue, Arial, sans-serif',
          fontSize: '64px',
          fontWeight: '500',
          color: '#1a1a1a',
          textTransform: 'uppercase',
          letterSpacing: '-0.5px',
          lineHeight: '1.1',
          textAlign: 'center',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility'
        }}>
          ACTUACIÓN SIN FILTROS.
        </h4>
        
        <h4 style={{
          margin: '0 0 25px 0',
          fontFamily: 'Druk, Impact, Arial Black, Helvetica Neue, Arial, sans-serif',
          fontSize: '64px',
          fontWeight: '500',
          color: '#1a1a1a',
          textTransform: 'uppercase',
          letterSpacing: '-0.5px',
          lineHeight: '1.1',
          textAlign: 'center',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility'
        }}>
          SIN MIEDOS NI LÍMITES.
        </h4>
        
        <p style={{
          margin: '0',
          fontFamily: 'Helvetica, sans-serif',
          fontSize: '13px',
          color: '#1a1a1a',
          textAlign: 'center',
          lineHeight: '1.6',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility'
        }}>
          <strong>Cada actriz tiene algo único.</strong><br />
          Nuestro trabajo es ayudarte a <strong>descubrirlo y proyectarlo</strong><br />
          con fuerza, acompañada por profesionales que ya vivieron esa transformación.
        </p>
      </div>

      {/* Bottom CTA Section */}
      <div style={{ 
        backgroundColor: '#1a1a1a',
        borderRadius: '0 0 30px 30px',
        padding: '50px 40px'
      }}>
        {/* Main container with responsive flex */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          
          {/* Left side: CTA + Button */}
          <div className="flex flex-col flex-1">
            {/* CTA Headline */}
            <div style={{ paddingBottom: '30px' }}>
              <h5 
                className="text-tag-yellow"
                style={{
                  margin: '0 0 10px 0',
                  fontFamily: 'Druk, Impact, Arial Black, Helvetica Neue, Arial, sans-serif',
                  fontSize: '32px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.5px',
                  textAlign: 'center',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}>
                ¿QUIERES DAR EL PRIMER PASO?
              </h5>
              
              <p style={{
                margin: '0',
                fontFamily: 'Helvetica, sans-serif',
                fontSize: '14px',
                color: '#e8e4da',
                lineHeight: '1.5',
                textAlign: 'center',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}>
                Déjanos tu teléfono para conversar sobre tus objetivos, sueños<br />
                y miedos reales :)
              </p>
            </div>

            {/* CTA Button */}
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <button 
                onClick={openFlyout}
                className="bg-tag-yellow"
                style={{
                  fontFamily: 'Druk, Impact, Arial Black, Helvetica Neue, Arial, sans-serif',
                  fontSize: '24px',
                  fontWeight: '500',
                  color: '#1a1a1a',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.5px',
                  display: 'inline-block',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility',
                  textAlign: 'center',
                  padding: '20px 80px',
                  borderRadius: '50px',
                  border: 'none',
                  cursor: 'pointer'
                }}
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
              <div style={{ 
                textAlign: 'center',
                flex: '1',
                minWidth: '200px'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  margin: '0 auto 15px auto',
                  border: '3px solid #f4b03e'
                }}>
                  <img 
                    src="https://mcusercontent.com/449da8926588f125f8a1cb1a7/images/bbf2c804-6ae5-2cfa-97b4-a23ede914cf6.jpg" 
                    alt="Tony Corvillo" 
                    style={{
                      width: '120px',
                      height: '120px',
                      display: 'block',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <h2 
                  className="text-tag-yellow"
                  style={{
                    margin: '0',
                    fontFamily: 'Druk, Impact, Arial Black, Helvetica Neue, Arial, sans-serif',
                    fontSize: '18px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.5px',
                    textAlign: 'center',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}>
                  Tony Corvillo
                </h2>
              </div>

              {/* Founder 2 */}
              <div style={{ 
                textAlign: 'center',
                flex: '1',
                minWidth: '200px'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  margin: '0 auto 15px auto',
                  border: '3px solid #f4b03e'
                }}>
                  <img 
                    src="https://mcusercontent.com/449da8926588f125f8a1cb1a7/images/032d3a3c-f6ba-a826-ed37-339fbc96e935.jpg" 
                    alt="Andrés Vicente" 
                    style={{
                      width: '120px',
                      height: '120px',
                      display: 'block',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <h2 
                  className="text-tag-yellow"
                  style={{
                    margin: '0',
                    fontFamily: 'Druk, Impact, Arial Black, Helvetica Neue, Arial, sans-serif',
                    fontSize: '18px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.5px',
                    textAlign: 'center',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}>
                  Andrés Vicente
                </h2>
              </div>
            </div>

            {/* Footer Info */}
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px'
            }}>
             
              
              <div 
              className="flex flex-col md:flex-row items-center justify-between"
              style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  height: '80px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end'
                }}>
                  <img 
                    src="https://mcusercontent.com/449da8926588f125f8a1cb1a7/images/4c56683f-7143-90ec-7562-3987b221a970.png" 
                    alt="TAG Badge" 
                    style={{
                      width: '100px',
                      height: '100px',
                      display: 'block',
                      borderRadius: '50%'
                    }}
                  />
                </div>
                <p style={{
                  margin: '0px 0 0 0',
                  fontFamily: 'Druk, Impact, Arial Black, Helvetica Neue, Arial, sans-serif',
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#f4b03e',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.5px',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}>
                  BUILT TO TRANSFORM<br />
                  BOLD PERFORMANCES
                </p>
              </div>

              <div style={{ paddingBottom: '20px', textAlign: 'center' }}>
                <p style={{
                  margin: '0',
                  fontFamily: 'Helvetica, sans-serif',
                  fontSize: '12px',
                  color: '#e8e4da',
                  lineHeight: '1.5',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}>
                 9333 98307
+34 682 56 01 87<br />
hola@theactinggarage.com
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
