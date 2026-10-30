import React, { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'amber' | 'emerald' | 'outline' | 'glass';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-paper-200 dark:bg-broadside-800 text-ink dark:text-broadside-ink border-paper-300 dark:border-broadside-700',
    amber: 'bg-amber-100 dark:bg-amber-950/50 text-sepia dark:text-gold border-sepia/30 dark:border-gold/30',
    emerald: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
    outline: 'border border-paper-300 dark:border-broadside-700 text-ink-muted dark:text-broadside-ink/70 bg-transparent',
    glass: 'bg-paper-100/80 dark:bg-broadside-850/80 text-ink dark:text-broadside-ink border border-paper-300 dark:border-broadside-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono font-medium tracking-wide transition-colors border select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
