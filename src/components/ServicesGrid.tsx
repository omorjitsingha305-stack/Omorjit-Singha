import React from 'react';
import { Train, Plane, Bus, BookUser, IdCard, Briefcase, ArrowUpRight, Check } from 'lucide-react';
import { SERVICES_CONFIG } from '../utils/storage';
import { ServiceCategory } from '../types/booking';

interface ServicesGridProps {
  onSelectService: (serviceId: ServiceCategory) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onSelectService }) => {
  const getIcon = (id: ServiceCategory) => {
    switch (id) {
      case 'railway':
        return <Train className="w-5 h-5 text-blue-600" />;
      case 'flight':
        return <Plane className="w-5 h-5 text-sky-600" />;
      case 'bus':
        return <Bus className="w-5 h-5 text-amber-600" />;
      case 'passport':
        return <BookUser className="w-5 h-5 text-emerald-600" />;
      case 'driving_license':
        return <IdCard className="w-5 h-5 text-indigo-600" />;
      case 'job_application':
        return <Briefcase className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <section id="services-section" className="py-12 bg-neutral-50/70 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Comprehensive Service Desk
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mt-1">
              Select the service you need assistance with
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Click any service below to automatically prepare your customized booking form.
            </p>
          </div>
          <div className="text-xs text-neutral-500 hidden sm:block text-right">
            <span>6 Core Services</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>IRCTC & Parivahan Compliant</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES_CONFIG.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-xl border border-neutral-200/90 p-5 hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-neutral-100 group-hover:bg-blue-50 transition-colors">
                    {getIcon(srv.id)}
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectService(srv.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors group-hover:translate-x-0.5"
                  >
                    <span>Apply Now</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                  {srv.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 font-medium">
                  {srv.tagline}
                </p>

                <p className="text-xs text-neutral-600 mt-2.5 leading-relaxed">
                  {srv.description}
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Key Options & Coverage:
                  </div>
                  <ul className="space-y-1.5 text-xs text-neutral-700">
                    {srv.subServices.slice(0, 3).map((sub, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="truncate">{sub}</span>
                      </li>
                    ))}
                    {srv.subServices.length > 3 && (
                      <li className="text-[11px] text-neutral-400 pl-5">
                        +{srv.subServices.length - 3} more specialized options
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <button
                  type="button"
                  onClick={() => onSelectService(srv.id)}
                  className="w-full py-2.5 px-3 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-blue-600 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Select & Fill Form</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
