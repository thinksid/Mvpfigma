import React, { createContext, useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionContextType {
  openItem: string | null;
  setOpenItem: (value: string | null) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

interface AccordionProps {
  type: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({ 
  type, 
  collapsible = false, 
  defaultValue = '', 
  className = '',
  children 
}) => {
  const [openItem, setOpenItem] = useState<string | null>(defaultValue || null);

  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem, type }}>
      <div className={className}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ value, className = '', children }) => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionItem must be used within Accordion');

  const isOpen = context.openItem === value;

  return (
    <div className={className} data-state={isOpen ? 'open' : 'closed'}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, isOpen } as any);
        }
        return child;
      })}
    </div>
  );
};

interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
  value?: string;
  isOpen?: boolean;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ 
  className = '', 
  children,
  value,
  isOpen 
}) => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be used within Accordion');

  const handleClick = () => {
    if (value) {
      context.setOpenItem(isOpen ? null : value);
    }
  };

  return (
    <button
      type="button"
      className={`flex items-center justify-between w-full py-4 transition-all ${className}`}
      onClick={handleClick}
      aria-expanded={isOpen}
    >
      {children}
      <ChevronDown 
        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
  );
};

interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
  value?: string;
  isOpen?: boolean;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({ 
  className = '', 
  children,
  isOpen 
}) => {
  return (
    <div
      className={`overflow-hidden transition-all duration-200 ${
        isOpen ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className={className}>
        {children}
      </div>
    </div>
  );
};
