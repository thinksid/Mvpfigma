import * as React from 'react';

export const VisuallyHidden = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className = '', ...props }, ref) => (
    <span
      ref={ref}
      className={`absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 ${className}`}
      {...props}
    />
  )
);

VisuallyHidden.displayName = 'VisuallyHidden';
