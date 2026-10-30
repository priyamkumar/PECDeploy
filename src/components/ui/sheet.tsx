import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  title?: React.ReactNode;
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  side = 'left',
  title,
  children,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          'fixed inset-y-0 z-50 flex max-w-full',
          side === 'left' ? 'left-0' : 'right-0'
        )}
      >
        <div
          ref={sheetRef}
          className={cn(
            'w-screen max-w-xs sm:max-w-sm border-[#D5CFBE] dark:border-[#2A2E35] bg-[#F4F1EA] dark:bg-[#141619] p-5 shadow-2xl transition-colors duration-250 flex flex-col justify-between overflow-y-auto',
            side === 'left' ? 'border-r' : 'border-l',
            'animate-slide-up'
          )}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#D5CFBE] dark:border-[#2A2E35]">
              {title ? (
                <div className="text-base font-bold font-headline text-[#0A0A0A] dark:text-[#F5F5F0] tracking-tight">{title}</div>
              ) : (
                <span />
              )}
              <button
                onClick={onClose}
                aria-label="Close sheet"
                className="btn-press-3d rounded-xl p-2 text-[#4A4A4A] dark:text-[#9EA3A0] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0] bg-white dark:bg-[#1D2025] border border-[#D5CFBE] dark:border-[#2A2E35] min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="py-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
