import React, { createContext, useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionContextType {
  openItem: string | null;
  setOpenItem: (value: string | null) => void;
  type: 'single' | 'multiple';
  collapsible: boolean;
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
    <AccordionContext.Provider value={{ openItem, setOpenItem, type, collapsible }}>
      <div className={className}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemContextType {
  value: string;
  isOpen: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextType | undefined>(undefined);

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
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div className={className} data-state={isOpen ? 'open' : 'closed'}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ 
  className = '', 
  children
}) => {
  const context = useContext(AccordionContext);
  const itemContext = useContext(AccordionItemContext);
  
  if (!context) throw new Error('AccordionTrigger must be used within Accordion');
  if (!itemContext) throw new Error('AccordionTrigger must be used within AccordionItem');

  const handleClick = () => {
    const { value, isOpen } = itemContext;
    
    if (isOpen && context.collapsible) {
      // If open and collapsible, close it
      context.setOpenItem(null);
    } else if (!isOpen) {
      // If closed, open it
      context.setOpenItem(value);
    }
  };

  return (
    <button
      type="button"
      className={`flex items-center justify-between w-full py-4 transition-all ${className}`}
      onClick={handleClick}
      aria-expanded={itemContext.isOpen}
    >
      {children}
      <ChevronDown 
        className={`w-4 h-4 transition-transform duration-200 ${itemContext.isOpen ? 'rotate-180' : ''}`}
      />
    </button>
  );
};

interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({ 
  className = '', 
  children
}) => {
  const itemContext = useContext(AccordionItemContext);
  
  if (!itemContext) throw new Error('AccordionContent must be used within AccordionItem');
  
  if (!itemContext.isOpen) {
    return null;
  }

  return (
    <div className={`overflow-hidden animate-in slide-in-from-top-2 duration-200 ${className}`}>
      {children}
    </div>
  );
};
