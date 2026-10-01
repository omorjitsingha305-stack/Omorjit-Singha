import React from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import { BusinessConfig, ServiceCategory } from '../types/booking';
import { SERVICES_CONFIG } from '../utils/storage';

interface FooterSectionProps {
  businessConfig: BusinessConfig;
  onSelectService: (service: ServiceCategory) => void;
  onOpenManagement: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  businessConfig,
  onSelectService,
  onOpenManagement
}) => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 pt-12 pb-16 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand & Summary */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white tracking-tight">
              {businessConfig.businessName}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Trusted online facilitator for Indian Railways Tatkal/AC reservations, domestic & international air tickets, interstate bus travel, passport applications, and Sarkari job form submissions.
            </p>
            <div className="pt-2 text-xs text-neutral-400">
              <span className="font-semibold text-neutral-200">Owner:</span> {businessConfig.ownerName}
            </div>
          </div>

          {/* Quick Service Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Services Offered
            </h4>
            <ul className="space-y-2 text-xs">
              {SERVICES_CONFIG.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onSelectService(s.id)}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Helpline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Helpline & Support
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-mono tabular-nums font-semibold">
                    <a href={`tel:${businessConfig.primaryPhone.replace(/\s+/g, '')}`} className="hover:underline">
                      {businessConfig.primaryPhone}
                    </a>
                  </div>
                  <div className="text-[11px] text-neutral-500">Direct phone call available</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="truncate">
                  <a href={`mailto:${businessConfig.email}`} className="text-neutral-300 hover:underline">
                    {businessConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>{businessConfig.workingHours}</div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>{businessConfig.location}</div>
              </div>
            </div>
          </div>

          {/* System & Privacy */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Management & Security
            </h4>
            <div className="space-y-3 text-xs text-neutral-400">
              <p className="leading-relaxed">
                All booking inquiries and customer records are safely stored in your browser session for direct processing.
              </p>
              <div>
                <button
                  type="button"
                  onClick={onOpenManagement}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-neutral-700"
                >
                  Open Customer Records Dashboard
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Client Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3">
          <div>
            &copy; {new Date().getFullYear()} {businessConfig.businessName}. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>Built for seamless online bookings and documentation support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
