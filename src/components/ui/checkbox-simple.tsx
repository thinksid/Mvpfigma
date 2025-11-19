import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({ 
  id,
  checked = false, 
  onCheckedChange,
  className = '',
  disabled = false
}) => {
  const handleChange = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <button
      type="button"
      id={id}
      role="checkbox"
      aria-checked={checked}
      onClick={handleChange}
      disabled={disabled}
      className={`h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-[#5b81ff] border-[#5b81ff]' : 'bg-white'
      } ${className}`}
    >
      {checked && (
        <Check className="h-3 w-3 text-white" strokeWidth={3} />
      )}
    </button>
  );
};
