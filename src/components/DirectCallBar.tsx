import React from 'react';
import { Phone, MessageSquare, Clock } from 'lucide-react';
import { BusinessConfig } from '../types/booking';

interface DirectCallBarProps {
  businessConfig: BusinessConfig;
}

export const DirectCallBar: React.FC<DirectCallBarProps> = ({ businessConfig }) => {
  return (
    <aside 
      aria-label="Direct helpline"
      className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-30 flex items-center gap-2 print:hidden"
    >
      {/* WhatsApp Quick Inquire */}
      <a
        href={`https://wa.me/${businessConfig.whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
          'Hi Omorjit Singha, I would like to inquire about booking/document services.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-emerald-600"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="w-5 h-5" />
      </a>

      {/* Direct Phone Call Button */}
      <a
        href={`tel:${businessConfig.primaryPhone.replace(/\s+/g, '')}`}
        className="flex items-center gap-2 px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-blue-600"
        title={`Direct Call: ${businessConfig.primaryPhone}`}
        aria-label={`Call Omorjit Singha directly at ${businessConfig.primaryPhone}`}
      >
        <div className="relative">
          <Phone className="w-5 h-5 animate-pulse" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-[10px] uppercase font-bold text-blue-200 leading-tight">
            Direct Helpline
          </div>
          <div className="text-xs font-bold font-mono tabular-nums leading-tight">
            {businessConfig.primaryPhone}
          </div>
        </div>
        <span className="sm:hidden text-xs font-bold">Call Now</span>
      </a>
    </aside>
  );
};
