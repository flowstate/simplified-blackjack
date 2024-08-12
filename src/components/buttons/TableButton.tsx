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
        'size-24 rounded-full border-2 border-foreground relative',
        className,
        { 'saturate-0': disabled } // Add saturation class if disabled
      )}
      disabled={disabled} // Ensure button is disabled
      {...props}
    >
      <div className='size-full bg-foreground opacity-10 rounded-full' />
      <span className='text-foreground text-2xl font-display opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        {children}
      </span>
    </button>
  );
});

export default TableButton;
