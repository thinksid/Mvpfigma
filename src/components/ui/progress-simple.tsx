import React from 'react';

interface ProgressProps {
  value: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className = '' }) => {
  // Ensure value is between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));
  
  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300 ease-out"
        style={{ width: `${clampedValue}%` }}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};
