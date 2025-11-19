import * as React from 'react';

export const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`relative overflow-auto ${className}`} {...props}>
      {children}
    </div>
  )
);

ScrollArea.displayName = 'ScrollArea';

export const ScrollBar: React.FC<any> = () => null;
