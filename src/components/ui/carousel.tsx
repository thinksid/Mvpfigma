import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselContextType {
  currentIndex: number;
  totalSlides: number;
  scrollNext: () => void;
  scrollPrev: () => void;
  canScrollNext: boolean;
  canScrollPrev: boolean;
}

const CarouselContext = React.createContext<CarouselContextType | undefined>(undefined);

interface CarouselProps {
  opts?: {
    align?: 'start' | 'center' | 'end';
    loop?: boolean;
  };
  children: React.ReactNode;
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ opts = {}, children, className = '' }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [totalSlides, setTotalSlides] = React.useState(0);

  const canScrollPrev = opts.loop || currentIndex > 0;
  const canScrollNext = opts.loop || currentIndex < totalSlides - 1;

  const scrollNext = () => {
    if (opts.loop) {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    } else if (currentIndex < totalSlides - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const scrollPrev = () => {
    if (opts.loop) {
      setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    } else if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <CarouselContext.Provider
      value={{
        currentIndex,
        totalSlides,
        scrollNext,
        scrollPrev,
        canScrollNext,
        canScrollPrev,
      }}
    >
      <div className={`relative ${className}`}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === CarouselContent) {
            return React.cloneElement(child, { setTotalSlides } as any);
          }
          return child;
        })}
      </div>
    </CarouselContext.Provider>
  );
};

interface CarouselContentProps {
  children: React.ReactNode;
  className?: string;
  setTotalSlides?: (count: number) => void;
}

export const CarouselContent: React.FC<CarouselContentProps> = ({ children, className = '', setTotalSlides }) => {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error('CarouselContent must be used within Carousel');

  React.useEffect(() => {
    const count = React.Children.count(children);
    setTotalSlides?.(count);
  }, [children, setTotalSlides]);

  return (
    <div className="overflow-hidden">
      <div
        className={`flex transition-transform duration-300 ease-in-out ${className}`}
        style={{ transform: `translateX(-${context.currentIndex * 100}%)` }}
      >
        {children}
      </div>
    </div>
  );
};

interface CarouselItemProps {
  children: React.ReactNode;
  className?: string;
}

export const CarouselItem: React.FC<CarouselItemProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-w-0 shrink-0 grow-0 basis-full ${className}`}>
      {children}
    </div>
  );
};

interface CarouselPreviousProps {
  className?: string;
}

export const CarouselPrevious: React.FC<CarouselPreviousProps> = ({ className = '' }) => {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error('CarouselPrevious must be used within Carousel');

  return (
    <button
      onClick={context.scrollPrev}
      disabled={!context.canScrollPrev}
      className={`absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <ChevronLeft className="h-6 w-6" />
    </button>
  );
};

interface CarouselNextProps {
  className?: string;
}

export const CarouselNext: React.FC<CarouselNextProps> = ({ className = '' }) => {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error('CarouselNext must be used within Carousel');

  return (
    <button
      onClick={context.scrollNext}
      disabled={!context.canScrollNext}
      className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <ChevronRight className="h-6 w-6" />
    </button>
  );
};
