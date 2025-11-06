import React from 'react';
import { CarouselSlide } from '../../types/diy';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import { Card } from '../ui/card';
import { MapPin, Quote } from 'lucide-react';

interface CarouselPreviewProps {
  slides: CarouselSlide[];
}

// Helper function to safely convert any value to a string
const safeString = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    // If it's an object with farm data, create a meaningful string
    const acres = value.acres || '';
    const crop = value.crop_type || '';
    const state = value.state_abbr || '';
    
    // Build a string from available parts
    const parts = [];
    if (acres && acres !== 'null') parts.push(`${acres} acres`);
    if (crop && crop !== 'null') parts.push(crop);
    if (state && state !== 'null') parts.push(state);
    
    if (parts.length > 0) {
      return parts.join(', ');
    }
    
    // If no meaningful parts, return empty string instead of JSON
    return '';
  }
  return String(value);
};

export const CarouselPreview: React.FC<CarouselPreviewProps> = ({ slides }) => {
  if (!slides || slides.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No slides to preview</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.slide_number}>
              <Card className="border-2 border-gray-200 shadow-lg">
                {/* Header Section */}
                <div className="bg-gradient-to-br from-[#1c1c60] to-[#5b81ff] text-white p-8">
                  <div className="flex items-start gap-6">
                    {/* Customer Photo */}
                    <div className="flex-shrink-0">
                      {slide.photo_url === 'placeholder' || !slide.photo_url ? (
                        <div className="w-24 h-24 rounded-full bg-[#ebff82] flex items-center justify-center">
                          <span className="text-3xl text-[#1c1c60]">
                            {(slide.name || slide.customer_name || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={slide.photo_url}
                          alt={slide.name || slide.customer_name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
                        />
                      )}
                    </div>

                    {/* Customer Info */}
                    <div className="flex-1">
                      <h3 className="text-2xl mb-2">{safeString(slide.name || slide.customer_name)}</h3>
                      <div className="flex items-center gap-2 text-white/80 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{safeString(slide.location)}</span>
                      </div>
                      <div className="inline-block bg-[#ebff82] text-[#1c1c60] px-4 py-1 rounded-full text-sm">
                        {safeString(slide.product_service)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Story Content */}
                <div className="p-8 space-y-6">
                  {/* Headline */}
                  {slide.headline && (
                    <div>
                      <h4 className="text-2xl text-[#1c1c60] mb-4">{safeString(slide.headline)}</h4>
                    </div>
                  )}

                  {/* Context */}
                  {(slide.farm_context || slide.context) && (
                    <div>
                      <h4 className="text-lg text-[#1c1c60] mb-2">Background</h4>
                      <p className="text-gray-700 leading-relaxed">{safeString(slide.farm_context || slide.context)}</p>
                    </div>
                  )}

                  {/* Problem */}
                  {(slide.challenge || slide.problem) && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                      <h4 className="text-lg text-red-900 mb-2">The Challenge</h4>
                      <p className="text-red-800 leading-relaxed">{safeString(slide.challenge || slide.problem)}</p>
                    </div>
                  )}

                  {/* Solution */}
                  {slide.solution && (
                    <div className="bg-blue-50 border-l-4 border-[#5b81ff] p-4 rounded">
                      <h4 className="text-lg text-[#1c1c60] mb-2">The Solution</h4>
                      <p className="text-gray-700 leading-relaxed">{safeString(slide.solution)}</p>
                    </div>
                  )}

                  {/* Results Grid */}
                  {(slide.technical_metric || slide.technical_result || slide.financial_metric || slide.meaningful_result) && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {(slide.technical_metric || slide.technical_result) && (
                        <div className="bg-gradient-to-br from-[#5b81ff]/10 to-[#ebff82]/10 p-4 rounded-lg border border-[#5b81ff]/20">
                          <h4 className="text-lg text-[#1c1c60] mb-2">📊 Technical Results</h4>
                          <p className="text-gray-700 leading-relaxed">{safeString(slide.technical_metric || slide.technical_result)}</p>
                        </div>
                      )}
                      {(slide.financial_metric || slide.meaningful_result) && (
                        <div className="bg-gradient-to-br from-[#ebff82]/10 to-[#5b81ff]/10 p-4 rounded-lg border border-[#5b81ff]/20">
                          <h4 className="text-lg text-[#1c1c60] mb-2">💡 Meaningful Impact</h4>
                          <p className="text-gray-700 leading-relaxed">{safeString(slide.financial_metric || slide.meaningful_result)}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quote */}
                  {(slide.customer_quote || slide.quote) && (slide.customer_quote !== 'placeholder' && slide.quote !== 'placeholder') && (
                    <div className="bg-gradient-to-br from-[#1c1c60] to-[#5b81ff] text-white p-6 rounded-lg relative">
                      <Quote className="w-8 h-8 text-[#ebff82] mb-3 opacity-50" />
                      <blockquote className="text-xl italic leading-relaxed">
                        "{safeString(slide.customer_quote || slide.quote)}"
                      </blockquote>
                      <p className="mt-4 text-white/80">
                        — {safeString(slide.name || slide.customer_name)}, {safeString(slide.location)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Slide Number Indicator */}
                <div className="px-8 pb-6">
                  <div className="flex items-center justify-center gap-2">
                    {slides.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all ${
                          index === slide.slide_number - 1
                            ? 'w-8 bg-[#5b81ff]'
                            : 'w-2 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 -translate-x-1/2" />
        <CarouselNext className="right-0 translate-x-1/2" />
      </Carousel>
    </div>
  );
};
