import React from 'react';
import { Phone, CheckCircle2, Shield, Clock, ArrowRight, MessageSquare } from 'lucide-react';
import heroImage from '../assets/images/hero_booking_services_1790842177869.jpg';
import { BusinessConfig } from '../types/booking';

interface HeroSectionProps {
  businessConfig: BusinessConfig;
  onBookNowClick: () => void;
  onViewRecordsClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  businessConfig,
  onBookNowClick,
  onViewRecordsClick
}) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
              <span className="text-blue-700 font-semibold">{businessConfig.ownerName}</span>
              <span aria-hidden="true">·</span>
              <span>Fast Online Processing</span>
              <span aria-hidden="true">·</span>
              <span>IRCTC & Citizen Portal Desk</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight text-balance">
              Fast, reliable online travel & citizen documentation assistance
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
              Submit your booking request in minutes. We handle Tatkal rail seats, flight deals, interstate buses, passport applications, driving licenses, and govt job submissions with 100% accuracy.
            </p>

            {/* Claim to Proof Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-50 border border-neutral-200/70">
                <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-neutral-900">Tatkal Specialists</div>
                  <div className="text-[11px] text-neutral-500">10:00 & 11:00 AM booking</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-50 border border-neutral-200/70">
                <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-neutral-900">Verified Forms</div>
                  <div className="text-[11px] text-neutral-500">Zero-rejection audit</div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-start gap-2.5 p-3 rounded-lg bg-neutral-50 border border-neutral-200/70">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-neutral-900">Direct Support</div>
                  <div className="text-[11px] text-neutral-500">Instant phone callback</div>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons including Direct Phone Call */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onBookNowClick}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <span>Submit Booking Request</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${businessConfig.primaryPhone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 rounded-lg border border-neutral-300 transition-colors whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Call {businessConfig.primaryPhone}</span>
              </a>

              <a
                href={`https://wa.me/${businessConfig.whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  'Hello Omorjit Singha, I want to inquire about your booking services.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Query</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Anchor */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-md bg-neutral-100 aspect-16/10 lg:aspect-4/3 group">
              <img
                src={heroImage}
                alt="Omorjit Singha Online Booking Services Office and Ticket Services"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="text-xs uppercase tracking-wider font-semibold text-blue-300">
                  Reliable Citizen Service Hub
                </div>
                <div className="text-base font-bold mt-0.5">
                  Omorjit Singha Online Booking Services
                </div>
                <div className="text-xs text-neutral-300 mt-1 flex items-center justify-between">
                  <span>{businessConfig.workingHours}</span>
                  <button
                    onClick={onViewRecordsClick}
                    className="text-xs text-white underline underline-offset-2 hover:text-blue-200 cursor-pointer"
                  >
                    View active orders &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
