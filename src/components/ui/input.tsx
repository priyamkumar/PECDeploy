import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, icon, ...props }, ref) => {
    return (
      <div className="w-full relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B45309] dark:text-[#E6AF2E] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'flex h-11 min-h-[44px] w-full rounded-xl border border-[#D5CFBE] dark:border-[#2A2E35] bg-white dark:bg-[#141619] px-3.5 py-2 text-sm text-[#0A0A0A] dark:text-[#F5F5F0] placeholder:text-[#4A4A4A] dark:placeholder:text-[#9EA3A0] font-mono tabular-nums transition-colors duration-250',
            'focus:outline-none focus:border-[#0A0A0A] dark:focus:border-[#E6AF2E] focus:ring-1 focus:ring-[#0A0A0A]/20 dark:focus:ring-[#E6AF2E]/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-10',
            error && 'border-rose-500 focus:border-rose-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-rose-500 font-mono">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
