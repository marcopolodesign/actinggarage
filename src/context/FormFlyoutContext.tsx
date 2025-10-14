import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FormFlyoutContextType {
  isOpen: boolean;
  openFlyout: () => void;
  closeFlyout: () => void;
}

const FormFlyoutContext = createContext<FormFlyoutContextType | undefined>(undefined);

export const useFormFlyout = () => {
  const context = useContext(FormFlyoutContext);
  if (context === undefined) {
    throw new Error('useFormFlyout must be used within a FormFlyoutProvider');
  }
  return context;
};

interface FormFlyoutProviderProps {
  children: ReactNode;
}

export const FormFlyoutProvider: React.FC<FormFlyoutProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openFlyout = () => setIsOpen(true);
  const closeFlyout = () => setIsOpen(false);

  return (
    <FormFlyoutContext.Provider value={{ isOpen, openFlyout, closeFlyout }}>
      {children}
    </FormFlyoutContext.Provider>
  );
};