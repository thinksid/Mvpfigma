import * as React from 'react';

export const Breadcrumb = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<'nav'>>(
  ({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />
);

Breadcrumb.displayName = 'Breadcrumb';

export const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<'ol'>>(
  ({ className = '', ...props }, ref) => (
    <ol
      ref={ref}
      className={`flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5 ${className}`}
      {...props}
    />
  )
);

BreadcrumbList.displayName = 'BreadcrumbList';

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
  ({ className = '', ...props }, ref) => (
    <li ref={ref} className={`inline-flex items-center gap-1.5 ${className}`} {...props} />
  )
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

export const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<'a'>>(
  ({ className = '', ...props }, ref) => (
    <a ref={ref} className={`transition-colors hover:text-foreground ${className}`} {...props} />
  )
);

BreadcrumbLink.displayName = 'BreadcrumbLink';

export const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<'span'>>(
  ({ className = '', ...props }, ref) => (
    <span ref={ref} role="link" aria-disabled="true" aria-current="page" className={`font-normal text-foreground ${className}`} {...props} />
  )
);

BreadcrumbPage.displayName = 'BreadcrumbPage';

export const BreadcrumbSeparator: React.FC<React.ComponentProps<'li'>> = ({ children, className = '', ...props }) => (
  <li role="presentation" aria-hidden="true" className={`[&>svg]:size-3.5 ${className}`} {...props}>
    {children ?? '/'}
  </li>
);

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export const BreadcrumbEllipsis: React.FC<React.ComponentProps<'span'>> = ({ className, ...props }) => (
  <span role="presentation" aria-hidden="true" className={`flex h-9 w-9 items-center justify-center ${className}`} {...props}>
    <span className="sr-only">More</span>
    <span>...</span>
  </span>
);

BreadcrumbEllipsis.displayName = 'BreadcrumbElipssis';
