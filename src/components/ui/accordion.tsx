import React, { createContext, useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionContextType {
  type: 'single' | 'multiple';
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

interface AccordionProps {
  type: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  type,
  value: controlledValue,
  defaultValue = type === 'single' ? '' : [],
  onValueChange,
  children,
  className = ''
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const handleValueChange = (newValue: string | string[]) => {
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  return (
    <AccordionContext.Provider value={{ type, value, onValueChange: handleValueChange }}>
      <div className={className}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemContextType {
  isOpen: boolean;
  toggle: () => void;
}

const AccordionItemContext = createContext<AccordionItemContextType | undefined>(undefined);

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ value, children, className = '' }) => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionItem must be used within Accordion');

  const isOpen = context.type === 'single' 
    ? context.value === value
    : (context.value as string[]).includes(value);

  const toggle = () => {
    if (context.type === 'single') {
      context.onValueChange(isOpen ? '' : value);
    } else {
      const currentValue = context.value as string[];
      context.onValueChange(
        isOpen
          ? currentValue.filter(v => v !== value)
          : [...currentValue, value]
      );
    }
  };

  return (
    <AccordionItemContext.Provider value={{ isOpen, toggle }}>
      <div className={`border-b ${className}`}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, className = '' }) => {
  const context = useContext(AccordionItemContext);
  if (!context) throw new Error('AccordionTrigger must be used within AccordionItem');

  return (
    <button
      onClick={context.toggle}
      className={`flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline ${className}`}
    >
      {children}
      <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${context.isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
};

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({ children, className = '' }) => {
  const context = useContext(AccordionItemContext);
  if (!context) throw new Error('AccordionContent must be used within AccordionItem');

  if (!context.isOpen) return null;

  return (
    <div className={`overflow-hidden text-sm transition-all ${className}`}>
      <div className="pb-4 pt-0">
        {children}
      </div>
    </div>
  );
};
