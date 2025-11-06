import React from 'react';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: 'Create Testimonials' },
  { number: 2, label: 'Preview Carousel' },
  { number: 3, label: 'Download Code' },
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'future';
  };

  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-4xl mx-auto px-6">
        {/* Mobile View: Simple text indicator */}
        <div className="md:hidden text-center">
          <div className="text-sm text-[#5b81ff] mb-1">
            Step {currentStep} of {steps.length}
          </div>
          <h2 className="text-xl text-[#1c1c60]">
            {steps[currentStep - 1].label}
          </h2>
        </div>

        {/* Desktop View: Full progress indicator */}
        <div className="hidden md:block">
          <div className="flex items-center justify-center relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div
                className="h-full bg-[#5b81ff] transition-all duration-500"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Step Indicators */}
            {steps.map((step, index) => {
              const status = getStepStatus(step.number);

              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center"
                  style={{ width: '200px' }}
                >
                  {/* Circle */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                      status === 'completed'
                        ? 'bg-[#5b81ff] text-white'
                        : status === 'active'
                        ? 'bg-[#1c1c60] text-white ring-4 ring-[#1c1c60]/20'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {status === 'completed' ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <span className="text-lg font-semibold">{step.number}</span>
                    )}
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <div
                      className={`text-sm font-medium transition-colors ${
                        status === 'completed' || status === 'active'
                          ? 'text-[#1c1c60]'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </div>
                    {status === 'active' && (
                      <div className="text-xs text-[#5b81ff] mt-1">Current Step</div>
                    )}
                    {status === 'completed' && (
                      <div className="text-xs text-[#5b81ff] mt-1">Complete</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
