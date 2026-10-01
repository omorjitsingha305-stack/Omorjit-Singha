import React from 'react';
import { X, Printer, Phone, CheckCircle, Train, Plane, Bus, BookUser, IdCard, Briefcase } from 'lucide-react';
import { CustomerRecord, BusinessConfig } from '../types/booking';

interface BookingReceiptModalProps {
  customer: CustomerRecord | null;
  businessConfig: BusinessConfig;
  onClose: () => void;
}

export const BookingReceiptModal: React.FC<BookingReceiptModalProps> = ({
  customer,
  businessConfig,
  onClose
}) => {
  if (!customer) return null;

  const handlePrint = () => {
    window.print();
  };

  const getServiceIcon = () => {
    switch (customer.service) {
      case 'railway': return <Train className="w-5 h-5 text-blue-600" />;
      case 'flight': return <Plane className="w-5 h-5 text-sky-600" />;
      case 'bus': return <Bus className="w-5 h-5 text-amber-600" />;
      case 'passport': return <BookUser className="w-5 h-5 text-emerald-600" />;
      case 'driving_license': return <IdCard className="w-5 h-5 text-indigo-600" />;
      case 'job_application': return <Briefcase className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl w-full max-w-xl overflow-hidden my-4 printable-slip">
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-neutral-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              Customer Booking Slip
            </span>
            <span className="font-mono tabular-nums text-xs text-neutral-500">
              #{customer.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600" />
              <span>Print Slip</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Slip Content */}
        <div className="p-6 sm:p-8 space-y-6 bg-white text-neutral-900">
          {/* Header */}
          <div className="border-b-2 border-neutral-900 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-neutral-900">
                  {businessConfig.businessName}
                </h2>
                <div className="text-xs text-neutral-600 mt-1 space-y-0.5">
                  <p>Authorized Travel & Citizen Form Submission Services</p>
                  <p>Proprietor: {businessConfig.ownerName} · {businessConfig.location}</p>
                  <p className="font-mono tabular-nums">Direct Helpline: {businessConfig.primaryPhone}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-block px-2.5 py-1 text-[11px] font-bold uppercase rounded-sm border border-neutral-900 bg-neutral-100 text-neutral-900">
                  Official Acknowledgment
                </span>
                <div className="font-mono tabular-nums text-xs font-bold text-neutral-800 mt-1">
                  {customer.id}
                </div>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">Service Status:</span>
              <span className="font-bold text-neutral-900 px-2 py-0.5 bg-neutral-200/70 rounded">
                {customer.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">Priority:</span>
              <span className="font-semibold text-neutral-800">{customer.priority}</span>
            </div>
            <div className="text-neutral-500">
              Date: <span className="font-mono tabular-nums text-neutral-900">{new Date(customer.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Customer & Service Details Grid */}
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-1 mb-2">
                1. Customer Information
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-neutral-500 block">Full Name</span>
                  <span className="font-bold text-neutral-900 text-sm">{customer.fullName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Phone Number</span>
                  <span className="font-mono tabular-nums font-semibold text-neutral-900 text-sm">
                    {customer.phoneNumber}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Date of Birth</span>
                  <span className="font-mono tabular-nums text-neutral-800">
                    {customer.dob}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Age (Calculated)</span>
                  <span className="font-mono tabular-nums font-bold text-neutral-900">
                    {customer.age} Years Old
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-1 mb-2">
                2. Service Requirements
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="col-span-2 flex items-center gap-2 p-2 bg-neutral-50 rounded border border-neutral-200">
                  {getServiceIcon()}
                  <div>
                    <div className="font-bold text-neutral-900">{customer.subService}</div>
                    <div className="text-[11px] text-neutral-500 capitalize">Category: {customer.service.replace('_', ' ')}</div>
                  </div>
                </div>

                {customer.journeyOrTargetDate && (
                  <div>
                    <span className="text-neutral-500 block">Target / Travel Date</span>
                    <span className="font-mono tabular-nums font-semibold text-neutral-900">
                      {customer.journeyOrTargetDate}
                    </span>
                  </div>
                )}

                {(customer.sourceCity || customer.destinationCity) && (
                  <div>
                    <span className="text-neutral-500 block">Route / Destination</span>
                    <span className="font-medium text-neutral-900">
                      {customer.sourceCity || 'N/A'} &rarr; {customer.destinationCity || 'N/A'}
                    </span>
                  </div>
                )}

                {customer.notes && (
                  <div className="col-span-2">
                    <span className="text-neutral-500 block">Special Instructions / Details</span>
                    <p className="text-neutral-700 bg-neutral-50 p-2 rounded text-xs leading-relaxed border border-neutral-200/60 mt-0.5">
                      {customer.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Terms & Signatures */}
          <div className="pt-6 border-t border-neutral-200 text-xs">
            <div className="flex items-end justify-between pt-6">
              <div>
                <p className="text-[11px] text-neutral-500 max-w-xs leading-relaxed">
                  Thank you for booking with Omorjit Singha Online Booking Services. For queries, contact {businessConfig.primaryPhone}.
                </p>
              </div>
              <div className="text-center">
                <div className="w-36 border-b border-neutral-400 mb-1"></div>
                <div className="text-[11px] font-semibold text-neutral-700">Authorized Signature</div>
                <div className="text-[10px] text-neutral-400">Omorjit Singha Services</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between print:hidden">
          <a
            href={`tel:${customer.phoneNumber.replace(/\s+/g, '')}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Customer ({customer.phoneNumber})</span>
          </a>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Acknowledgment</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
