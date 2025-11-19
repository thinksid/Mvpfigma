import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button-simple';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CustomerStory {
  headline: string;
  name: string;
  location: string;
  photo: string;
  challenge: string;
  solution: string;
  metrics: string[];
  fullStory: {
    farmContext: string;
    challengeDetail: string;
    solutionDetail: string;
    results: string[];
    quote: string;
  };
}

interface ThinkSidsCarouselProps {
  stories: CustomerStory[];
}

export const ThinkSidsCarousel: React.FC<ThinkSidsCarouselProps> = ({ stories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
    setIsExpanded(false); // Collapse when changing slides
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
    setIsExpanded(false); // Collapse when changing slides
  };

  const currentStory = stories[currentIndex];

  return (
    <div className="relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#E2E8F0]">
        {/* Header with Photo and Basic Info */}
        <div className="bg-gradient-to-r from-[#5b81ff] to-[#1c1c60] p-4 sm:p-6 text-white">
          <div className="flex items-start gap-3 sm:gap-4">
            <ImageWithFallback
              src={currentStory.photo}
              alt={currentStory.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white shadow-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl lg:text-2xl mb-1 leading-tight">{currentStory.headline}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-white/90 text-sm sm:text-base">
                <p className="text-base sm:text-lg">{currentStory.name}</p>
                <span className="hidden sm:inline text-white/60">•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-sm sm:text-base">{currentStory.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics - Always Visible */}
        <div className="p-4 sm:p-8 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {currentStory.metrics.map((metric, idx) => (
              <div key={idx} className="bg-[#f3f3f3] rounded-lg p-3 sm:p-4 flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#ebff82] rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#1c1c60]" />
                </div>
                <p className="text-[#1c1c60] text-sm sm:text-base">{metric}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <div className="px-4 sm:px-8 pb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 py-3 text-[#5b81ff] hover:text-[#1c1c60] transition-colors"
          >
            <span className="font-medium text-sm sm:text-base">
              {isExpanded ? 'Show Less' : 'Read Full Story'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5 animate-bounce" />
            )}
          </button>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="px-4 sm:px-8 pb-6 sm:pb-8 border-t border-[#E2E8F0] pt-6 animate-in slide-in-from-top-4 duration-300">
            {/* Farm Context */}
            <div className="mb-6">
              <p className="text-[#5b81ff] text-sm mb-2">{currentStory.fullStory.farmContext}</p>
            </div>

            {/* Challenge */}
            <div className="mb-6">
              <h4 className="text-[#1c1c60] mb-2 text-base sm:text-lg">The Challenge</h4>
              <p className="text-[#717182] leading-relaxed text-sm sm:text-base">{currentStory.fullStory.challengeDetail}</p>
            </div>

            {/* Solution */}
            <div className="mb-6">
              <h4 className="text-[#1c1c60] mb-2 text-base sm:text-lg">The Solution</h4>
              <p className="text-[#717182] leading-relaxed text-sm sm:text-base">{currentStory.fullStory.solutionDetail}</p>
            </div>

            {/* Results */}
            <div className="mb-6">
              <h4 className="text-[#1c1c60] mb-3 text-base sm:text-lg">The Results</h4>
              <ul className="space-y-2">
                {currentStory.fullStory.results.map((result, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[#717182] text-sm sm:text-base">
                    <span className="text-[#5b81ff] mt-1">✓</span>
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quote */}
            <div className="bg-[#5b81ff]/5 border-l-4 border-[#5b81ff] p-4 sm:p-6 rounded-r-lg">
              <p className="text-[#1c1c60] text-base sm:text-lg italic">\"{currentStory.fullStory.quote}\"</p>
              <p className="text-[#5b81ff] mt-2 text-sm sm:text-base">— {currentStory.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          onClick={goToPrevious}
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full border-2 border-[#5b81ff] hover:bg-[#5b81ff] hover:text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <div className="flex items-center gap-2">
          {stories.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setIsExpanded(false);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentIndex ? 'bg-[#5b81ff] w-8' : 'bg-[#E2E8F0]'
              }`}
              aria-label={`Go to story ${idx + 1}`}
            />
          ))}
        </div>

        <Button
          onClick={goToNext}
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full border-2 border-[#5b81ff] hover:bg-[#5b81ff] hover:text-white"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Story counter */}
      <p className="text-center mt-4 text-[#717182]">
        Story {currentIndex + 1} of {stories.length}
      </p>
    </div>
  );
};