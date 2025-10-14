import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface AboutFlyoutContextType {
  isOpen: boolean;
  openFlyout: () => void;
  closeFlyout: () => void;
}

const AboutFlyoutContext = createContext<AboutFlyoutContextType | undefined>(undefined);

export const useAboutFlyout = () => {
  const context = useContext(AboutFlyoutContext);
  if (context === undefined) {
    throw new Error('useAboutFlyout must be used within an AboutFlyoutProvider');
  }
  return context;
};

interface AboutFlyoutProviderProps {
  children: ReactNode;
}

export const AboutFlyoutProvider: React.FC<AboutFlyoutProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openFlyout = () => setIsOpen(true);
  const closeFlyout = () => setIsOpen(false);

  return (
    <AboutFlyoutContext.Provider value={{ isOpen, openFlyout, closeFlyout }}>
      {children}
    </AboutFlyoutContext.Provider>
  );
};
