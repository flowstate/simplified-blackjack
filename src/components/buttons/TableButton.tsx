import React from 'react';

import { cn } from '@/lib/utils';

export const TableButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'size-24 rounded-full border-2 border-foreground relative transition-all hover:scale-110 active:scale-90 ease-in-out',
        className,
        { 'saturate-0 opacity-50 pointer-events-none': disabled }
      )}
      disabled={disabled}
      {...props}
    >
      <span className=' text-3xl font-display opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors'>
        {children}
      </span>
    </button>
  );
});

export default TableButton;
