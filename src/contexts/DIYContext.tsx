import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Testimonial, CarouselSlide } from '../types/diy';

// Define the shape of the context
interface DIYContextType {
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[]) => void;
  generationId: string | null;
  setGenerationId: (id: string | null) => void;
  previewData: CarouselSlide[] | null;
  setPreviewData: (data: CarouselSlide[] | null) => void;
  htmlCode: string | null;
  setHtmlCode: (html: string | null) => void;
}

// Create the context with undefined default value
const DIYContext = createContext<DIYContextType | undefined>(undefined);

// Provider component
interface DIYProviderProps {
  children: ReactNode;
}

export const DIYProvider: React.FC<DIYProviderProps> = ({ children }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<CarouselSlide[] | null>(null);
  const [htmlCode, setHtmlCode] = useState<string | null>(null);

  const value: DIYContextType = {
    testimonials,
    setTestimonials,
    generationId,
    setGenerationId,
    previewData,
    setPreviewData,
    htmlCode,
    setHtmlCode,
  };

  return <DIYContext.Provider value={value}>{children}</DIYContext.Provider>;
};

// Custom hook to use the DIY context
export const useDIY = (): DIYContextType => {
  const context = useContext(DIYContext);
  if (context === undefined) {
    throw new Error('useDIY must be used within a DIYProvider');
  }
  return context;
};