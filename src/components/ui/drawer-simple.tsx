import React, { createContext, useContext, useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ open: controlledOpen, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};

interface DrawerContentProps {
  children: React.ReactNode;
  className?: string;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({ children, className = '' }) => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error('DrawerContent must be used within Drawer');

  useEffect(() => {
    if (context.open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [context.open]);

  if (!context.open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 animate-in fade-in" 
        onClick={() => context.setOpen(false)}
      />
      
      {/* Drawer - slides from bottom on mobile */}
      <div className={`fixed bottom-0 left-0 right-0 max-h-[96vh] bg-white rounded-t-2xl animate-in slide-in-from-bottom ${className}`}>
        {children}
      </div>
    </div>
  );
};

interface DrawerHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 pt-6 ${className}`}>
      {children}
    </div>
  );
};

interface DrawerTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const DrawerTitle: React.FC<DrawerTitleProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
};

interface DrawerDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const DrawerDescription: React.FC<DrawerDescriptionProps> = ({ children, className = '' }) => {
  return (
    <p className={`text-sm text-gray-500 mt-2 ${className}`}>
      {children}
    </p>
  );
};

interface DrawerCloseProps {
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const DrawerClose: React.FC<DrawerCloseProps> = ({ asChild, children, className }) => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error('DrawerClose must be used within Drawer');

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => context.setOpen(false),
    } as any);
  }

  return (
    <button
      onClick={() => context.setOpen(false)}
      className={className}
    >
      {children || <X className="h-4 w-4" />}
    </button>
  );
};
