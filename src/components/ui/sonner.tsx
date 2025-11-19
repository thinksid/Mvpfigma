import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextType {
  addToast: (message: string, type: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export interface ToasterProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  children?: React.ReactNode;
}

let globalToastFunction: ((message: string, type: Toast['type']) => void) | null = null;

export const Toaster: React.FC<ToasterProps> = ({ position = 'top-right', children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { id, message, type };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Set global toast function
  useEffect(() => {
    globalToastFunction = addToast;
    return () => {
      globalToastFunction = null;
    };
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-2 pointer-events-none`}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${getBackgroundColor(toast.type)} border-2 rounded-lg shadow-lg p-4 pr-10 min-w-[300px] max-w-[500px] pointer-events-auto animate-in slide-in-from-top-2 duration-200`}
          >
            <div className="flex items-start gap-3">
              {getIcon(toast.type)}
              <p className="text-gray-800 flex-1 text-sm leading-relaxed">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Global toast function
export const toast = {
  success: (message: string) => {
    if (globalToastFunction) globalToastFunction(message, 'success');
  },
  error: (message: string) => {
    if (globalToastFunction) globalToastFunction(message, 'error');
  },
  warning: (message: string) => {
    if (globalToastFunction) globalToastFunction(message, 'warning');
  },
  info: (message: string) => {
    if (globalToastFunction) globalToastFunction(message, 'info');
  },
};
