import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
  showCloseButton = true,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        ref={dialogRef}
        className={cn(
          'relative z-50 w-full rounded-2xl border border-[#D5CFBE] dark:border-[#2A2E35] bg-[#F4F1EA] dark:bg-[#141619] p-6 sm:p-7 text-[#0A0A0A] dark:text-[#F5F5F0] shadow-2xl animate-slide-up transition-colors duration-250',
          maxWidthClasses[maxWidth]
        )}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="btn-press-3d absolute right-4 top-4 rounded-xl p-2 text-[#4A4A4A] dark:text-[#9EA3A0] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0] bg-white dark:bg-[#1D2025] border border-[#D5CFBE] dark:border-[#2A2E35] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {(title || description) && (
          <div className="mb-5 space-y-1.5 pr-8 border-b border-paper-300 dark:border-broadside-800 pb-3">
            {title && <h2 className="text-lg font-bold font-headline tracking-tight text-ink dark:text-white">{title}</h2>}
            {description && <p className="text-xs font-serif text-ink-muted dark:text-broadside-ink/70 leading-relaxed">{description}</p>}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};
