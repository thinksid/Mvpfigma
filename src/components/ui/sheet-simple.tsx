import React, { createContext, useContext, useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SheetContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({ open: controlledOpen, onOpenChange, children }) => {
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
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
};

interface SheetTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const SheetTrigger: React.FC<SheetTriggerProps> = ({ children, asChild, className }) => {
  const context = useContext(SheetContext);
  if (!context) throw new Error('SheetTrigger must be used within Sheet');

  const handleClick = () => context.setOpen(true);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
    } as any);
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

interface SheetContentProps {
  children: React.ReactNode;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const SheetContent: React.FC<SheetContentProps> = ({ 
  children, 
  className = '',
  side = 'right' 
}) => {
  const context = useContext(SheetContext);
  if (!context) throw new Error('SheetContent must be used within Sheet');

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

  const sideStyles = {
    top: 'top-0 left-0 right-0 h-auto',
    right: 'top-0 right-0 bottom-0 w-3/4 sm:max-w-sm',
    bottom: 'bottom-0 left-0 right-0 h-auto',
    left: 'top-0 left-0 bottom-0 w-3/4 sm:max-w-sm'
  };

  const slideAnimation = {
    top: 'animate-in slide-in-from-top',
    right: 'animate-in slide-in-from-right',
    bottom: 'animate-in slide-in-from-bottom',
    left: 'animate-in slide-in-from-left'
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 animate-in fade-in" 
        onClick={() => context.setOpen(false)}
      />
      
      {/* Sheet */}
      <div className={`fixed ${sideStyles[side]} bg-white shadow-lg ${slideAnimation[side]} ${className}`}>
        {children}
        <button
          onClick={() => context.setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
};

interface SheetHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const SheetHeader: React.FC<SheetHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col space-y-2 text-center sm:text-left px-6 pt-6 ${className}`}>
      {children}
    </div>
  );
};

interface SheetTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const SheetTitle: React.FC<SheetTitleProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
};

interface SheetDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const SheetDescription: React.FC<SheetDescriptionProps> = ({ children, className = '' }) => {
  return (
    <p className={`text-sm text-gray-500 ${className}`}>
      {children}
    </p>
  );
};
