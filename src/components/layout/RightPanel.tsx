import React from 'react';
import { AnonymousDiscovery } from '../discovery/AnonymousDiscovery';
import { Compass } from 'lucide-react';

export const RightPanel: React.FC = () => {
  return (
    <aside className="hidden xl:flex w-80 flex-col border-l border-[#D5CFBE] dark:border-[#2A2E35] bg-[#ECE8DF]/50 dark:bg-[#141619]/60 backdrop-blur-xl p-4 min-h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto transition-colors duration-250">
      {/* Editorial Header */}
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#D5CFBE] dark:border-[#2A2E35] text-xs font-kicker uppercase tracking-[0.12em] text-[#B45309] dark:text-[#E6AF2E] font-semibold select-none">
        <Compass className="h-4 w-4" />
        <span>The Anonymous Gazette</span>
      </div>

      {/* Discovery Recommendations */}
      <AnonymousDiscovery />
    </aside>
  );
};
