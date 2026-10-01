import React from 'react';
import { Phone, Users, CalendarPlus, ShieldCheck, Settings } from 'lucide-react';
import { BusinessConfig } from '../types/booking';

interface TopNavbarProps {
  activeTab: 'portal' | 'management';
  setActiveTab: (tab: 'portal' | 'management') => void;
  businessConfig: BusinessConfig;
  customerCount: number;
  onOpenSettings: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  setActiveTab,
  businessConfig,
  customerCount,
  onOpenSettings
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-shadow duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element Brand wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('portal')}
              className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
            >
              <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 block truncate max-w-[210px] sm:max-w-md">
                {businessConfig.businessName}
              </span>
              <span className="text-xs text-neutral-500 hidden sm:block">
                IRCTC Rail · Flights · Bus · Passport · Driving License · Job Support
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links / View Switcher */}
          <nav className="flex items-center p-1 bg-neutral-100 rounded-lg text-xs sm:text-sm font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('portal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'portal'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <CalendarPlus className="w-4 h-4 text-blue-600" />
              <span>Book Service</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('management')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'management'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span>Customer Records</span>
              <span className="font-mono tabular-nums text-xs px-1.5 py-0.2 bg-neutral-200/70 text-neutral-700 rounded-sm ml-0.5">
                {customerCount}
              </span>
            </button>
          </nav>

          {/* Zone 3: 1-2 Primary Actions (Direct Call & Settings) */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${businessConfig.primaryPhone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs whitespace-nowrap focus-visible:outline-2 focus-visible:outline-blue-600"
              title="Call Omorjit Singha directly"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Call:</span>
              <span className="font-mono tabular-nums">{businessConfig.primaryPhone}</span>
            </a>

            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors focus:outline-none"
              title="Business Settings & Contact Configuration"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
