import * as React from 'react';

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 1, className = '', style, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: `${100 / ratio}%`,
        ...style,
      }}
      className={className}
    >
      <div style={{ position: 'absolute', inset: 0 }} {...props} />
    </div>
  )
);

AspectRatio.displayName = 'AspectRatio';
