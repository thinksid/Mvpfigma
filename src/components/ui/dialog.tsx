import React, { createContext, useContext, useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open: controlledOpen, onOpenChange, children }) => {
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
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

interface DialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ asChild, children }) => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogTrigger must be used within Dialog');

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => context.setOpen(true),
    } as any);
  }

  return (
    <button onClick={() => context.setOpen(true)}>
      {children}
    </button>
  );
};

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  onEscapeKeyDown?: () => void;
  onInteractOutside?: () => void;
}

export const DialogContent: React.FC<DialogContentProps> = ({ 
  children, 
  className = '',
  onEscapeKeyDown,
  onInteractOutside
}) => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogContent must be used within Dialog');

  useEffect(() => {
    if (context.open) {
      document.body.style.overflow = 'hidden';
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onEscapeKeyDown?.();
          context.setOpen(false);
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [context.open, onEscapeKeyDown]);

  if (!context.open) return null;

  const handleOverlayClick = () => {
    onInteractOutside?.();
    context.setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 animate-in fade-in" 
        onClick={handleOverlayClick}
      />
      
      {/* Content */}
      <div className={`relative bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-4 animate-in fade-in zoom-in-95 ${className}`}>
        {children}
      </div>
    </div>
  );
};

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`}>
      {children}
    </div>
  );
};

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
};

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogDescription: React.FC<DialogDescriptionProps> = ({ children, className = '' }) => {
  return (
    <p className={`text-sm text-gray-500 ${className}`}>
      {children}
    </p>
  );
};

interface DialogCloseProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export const DialogClose: React.FC<DialogCloseProps> = ({ asChild, children }) => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogClose must be used within Dialog');

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => context.setOpen(false),
    } as any);
  }

  return (
    <button onClick={() => context.setOpen(false)}>
      {children || <X className="h-4 w-4" />}
    </button>
  );
};
