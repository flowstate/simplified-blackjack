import React from 'react';

import { cn } from '@/lib/utils';

export const DottedButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'rounded-lg w-52 border-4 border-dashed border-[#A5C3FE] bg-transparent px-4 py-2 text-xl font-semibold uppercase text-white transition-all duration-300',
        'hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_black]',
        'active:translate-x-[0px] active:translate-y-[0px] active:shadow-none',
        'disabled:opacity-50 disabled:pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export default DottedButton;
