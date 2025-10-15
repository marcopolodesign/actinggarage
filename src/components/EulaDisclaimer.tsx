import React, { useState, useEffect } from 'react';

const EulaDisclaimer: React.FC = () => {
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    // Check if user has already accepted EULA
    const eulaAccepted = localStorage.getItem('eula-accepted');
    if (eulaAccepted === 'true') {
      setIsAccepted(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('eula-accepted', 'true');
    setIsAccepted(true);
  };

  const handleDecline = () => {
    // Redirect to a decline page or close the site
    window.location.href = 'https://google.com';
  };

  if (isAccepted) return null;

  return (
    <div 
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black border border-tag-yellow z-50 p-4 md:p-6 rounded-md max-w-2xl w-full"
      style={{ borderColor: '#FFBE00' }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-5">
        <span 
          className="text-tag-yellow text-xs md:text-sm text-center md:text-left flex-1"
          style={{ color: '#FFBE00', fontFamily: 'MDIO, Arial, Helvetica, sans-serif' }}
        >
          Al continuar navegando, aceptas nuestros términos y condiciones de uso.
        </span>
        <div className="flex gap-3 flex-shrink-0 w-full md:w-auto justify-center">
          <button 
            className="px-3 py-2 md:px-4 md:py-2 border-2 border-tag-yellow rounded text-xs font-bold uppercase cursor-pointer transition-all duration-300 hover:bg-tag-yellow hover:text-black flex-1 md:flex-none min-w-20"
            style={{ 
              borderColor: '#FFBE00', 
              backgroundColor: '#1a1a1a', 
              color: '#FFBE00',
            //   fontFamily: 'Druk, Impact, Arial Black, sans-serif',
              letterSpacing: '0.5px'
            }}
            onClick={handleDecline}
          >
            DECLINAR
          </button>
          <button 
            className="px-3 py-2 md:px-4 md:py-2 border-2 border-tag-yellow rounded text-xs font-bold uppercase cursor-pointer transition-all duration-300 hover:bg-black hover:text-tag-yellow flex-1 md:flex-none min-w-20"
            style={{ 
              borderColor: '#FFBE00', 
              backgroundColor: '#FFBE00', 
              color: '#1a1a1a',
            //   fontFamily: 'Druk, Impact, Arial Black, sans-serif',
              letterSpacing: '0.5px'
            }}
            onClick={handleAccept}
          >
            ACEPTAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default EulaDisclaimer;
