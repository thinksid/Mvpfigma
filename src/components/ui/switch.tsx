import * as React from 'react';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = '', onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <label className="relative inline-block w-11 h-6">
        <input
          type="checkbox"
          className="peer sr-only"
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        <div className={`absolute inset-0 rounded-full bg-input transition peer-checked:bg-primary cursor-pointer ${className}`} />
        <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background transition-transform peer-checked:translate-x-5" />
      </label>
    );
  }
);

Switch.displayName = 'Switch';
