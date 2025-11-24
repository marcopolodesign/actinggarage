import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface FormFlyoutContextType {
  isOpen: boolean;
  openFlyout: (course?: string) => void;
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

  const openFlyout = (course?: string) => {
    // If course is provided, add it to URL params so form can pre-select it
    if (course) {
      const url = new URL(window.location.href);
      url.searchParams.set('course', course);
      window.history.pushState({}, '', url.toString());
    }
    setIsOpen(true);
  };
  const closeFlyout = () => setIsOpen(false);

  return (
    <FormFlyoutContext.Provider value={{ isOpen, openFlyout, closeFlyout }}>
      {children}
    </FormFlyoutContext.Provider>
  );
};