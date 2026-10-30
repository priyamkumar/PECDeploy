import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'glass' | 'amber' | 'emerald' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      'btn-press-3d inline-flex items-center justify-center font-bold rounded-xl transition-all select-none focus:outline-none disabled:opacity-50 disabled:pointer-events-none min-h-[40px]';

    const variants = {
      default: 'bg-paper-200 dark:bg-broadside-800 text-ink dark:text-broadside-ink border border-paper-300 dark:border-broadside-700 border-b-[3px] border-b-paper-400 dark:border-b-broadside-950 shadow-sm hover:bg-paper-300/80 dark:hover:bg-broadside-700',
      outline: 'border border-paper-300 dark:border-broadside-700 border-b-[3px] border-b-paper-400 dark:border-b-broadside-950 bg-transparent text-ink dark:text-broadside-ink hover:bg-paper-200/50 dark:hover:bg-broadside-800/50',
      ghost: 'border-0 border-b-0 bg-transparent hover:bg-paper-200/50 dark:hover:bg-broadside-800/50 text-ink-muted dark:text-broadside-ink/70 hover:text-ink dark:hover:text-white',
      glass: 'bg-paper-100/90 dark:bg-broadside-850/90 border border-paper-300 dark:border-broadside-700 border-b-[3px] border-b-paper-400 dark:border-b-broadside-950 text-ink dark:text-broadside-ink shadow-sm',
      amber: 'bg-ink dark:bg-gold text-paper-50 dark:text-broadside-950 font-bold border-b-[3px] border-b-black/50 dark:border-b-gold-dark shadow-md hover:bg-sepia dark:hover:bg-gold-light',
      emerald: 'bg-emerald-700 dark:bg-emerald-600 text-white font-bold border-b-[3px] border-b-emerald-900 shadow-md hover:bg-emerald-800 dark:hover:bg-emerald-500',
      destructive: 'bg-rose-700 text-white font-bold border-b-[3px] border-b-rose-950 shadow-sm hover:bg-rose-800',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 h-9 min-h-[36px]',
      md: 'text-xs sm:text-sm px-4 py-2 h-10 min-h-[40px]',
      lg: 'text-sm sm:text-base px-5 py-2.5 h-12 min-h-[48px]',
      icon: 'h-10 w-10 min-h-[40px] min-w-[40px] p-0 flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
