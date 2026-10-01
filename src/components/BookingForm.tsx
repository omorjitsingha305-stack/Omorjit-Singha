import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Calendar, 
  User, 
  Phone, 
  FileText, 
  CheckCircle, 
  Sparkles, 
  Clock, 
  MapPin, 
  AlertCircle,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { calculateAge, formatAgeDescription } from '../utils/ageCalculator';
import { SERVICES_CONFIG, generateBookingId } from '../utils/storage';
import { CustomerRecord, PriorityLevel, ServiceCategory } from '../types/booking';

interface BookingFormProps {
  selectedService: ServiceCategory;
  onSelectService: (service: ServiceCategory) => void;
  onSubmitBooking: (newCustomer: CustomerRecord) => void;
  primaryPhone: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedService,
  onSelectService,
  onSubmitBooking,
  primaryPhone
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [ageDisplay, setAgeDisplay] = useState('');
  
  const currentServiceDef = SERVICES_CONFIG.find(s => s.id === selectedService) || SERVICES_CONFIG[0];
  const [subService, setSubService] = useState(currentServiceDef.subServices[0]);
  const [priority, setPriority] = useState<PriorityLevel>('Standard');
  const [journeyOrTargetDate, setJourneyOrTargetDate] = useState('');
  const [sourceCity, setSourceCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [notes, setNotes] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<CustomerRecord | null>(null);

  // Update sub-service default when category changes
  useEffect(() => {
    if (currentServiceDef && currentServiceDef.subServices.length > 0) {
      setSubService(currentServiceDef.subServices[0]);
    }
  }, [selectedService]);

  // Reactive Age Calculation whenever DOB changes
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);
    
    if (!val) {
      setCalculatedAge(null);
      setAgeDisplay('');
      setErrors(prev => ({ ...prev, dob: '' }));
      return;
    }

    const birthDate = new Date(val);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
      setErrors(prev => ({ ...prev, dob: 'Please enter a valid date' }));
      setCalculatedAge(null);
      setAgeDisplay('');
      return;
    }

    if (birthDate > today) {
      setErrors(prev => ({ ...prev, dob: 'Date of birth cannot be in the future' }));
      setCalculatedAge(null);
      setAgeDisplay('');
      return;
    }

    setErrors(prev => ({ ...prev, dob: '' }));
    const age = calculateAge(val);
    setCalculatedAge(age);
    setAgeDisplay(formatAgeDescription(val));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (cleanPhone.length < 10) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!dob) {
      newErrors.dob = 'Date of birth is required';
    } else if (calculatedAge === null) {
      newErrors.dob = 'Please provide a valid date of birth';
    }

    if (!subService) {
      newErrors.subService = 'Please select a specific service option';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const newRecord: CustomerRecord = {
      id: generateBookingId(),
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      dob,
      age: calculatedAge ?? calculateAge(dob),
      service: selectedService,
      subService,
      status: 'Pending',
      priority,
      journeyOrTargetDate: journeyOrTargetDate || undefined,
      sourceCity: sourceCity.trim() || undefined,
      destinationCity: destinationCity.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save record to local storage via callback
    onSubmitBooking(newRecord);
    setSubmittedBooking(newRecord);
    setIsSubmitting(false);

    // Reset fields for fresh entry
    setFullName('');
    setPhoneNumber('');
    setDob('');
    setCalculatedAge(null);
    setAgeDisplay('');
    setJourneyOrTargetDate('');
    setSourceCity('');
    setDestinationCity('');
    setNotes('');
  };

  return (
    <section id="booking-form-section" className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-md mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Online Registration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Customer Booking & Service Submission
          </h2>
          <p className="text-sm text-neutral-500 mt-1 max-w-xl mx-auto">
            Fill in your details below. Your age will be automatically calculated from your Date of Birth.
          </p>
        </div>

        {submittedBooking && (
          <div className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-xl shadow-xs transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-emerald-950">
                    Booking Request Submitted Successfully!
                  </h3>
                  <div className="text-xs text-emerald-800 mt-1 space-y-0.5">
                    <div>
                      Booking Reference: <strong className="font-mono tabular-nums text-emerald-900">{submittedBooking.id}</strong>
                    </div>
                    <div>
                      Customer: <strong>{submittedBooking.fullName}</strong> · Age: <strong className="font-mono tabular-nums">{submittedBooking.age} yrs</strong> · Service: <strong>{submittedBooking.subService}</strong>
                    </div>
                    <p className="mt-2 text-emerald-700">
                      Omorjit Singha will verify your request shortly. Need urgent confirmation? Use the direct call button below.
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSubmittedBooking(null)}
                className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold px-2 py-1 hover:bg-emerald-100 rounded-md"
              >
                Dismiss
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200/60 flex flex-wrap items-center gap-3">
              <a
                href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call to Expedite: {primaryPhone}</span>
              </a>
              <span className="text-xs text-emerald-700">
                Saved securely in browser records.
              </span>
            </div>
          </div>
        )}

        {/* The Form */}
        <form onSubmit={handleSubmit} className="bg-neutral-50/70 border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Step 1: Service Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2.5">
              1. Choose Service Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SERVICES_CONFIG.map((srv) => {
                const isSelected = selectedService === srv.id;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => onSelectService(srv.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100/60'
                    }`}
                  >
                    <span className="truncate">{srv.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub Service and Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="subService" className="block text-xs font-semibold text-neutral-700 mb-1">
                Specific Service Option <span className="text-red-500">*</span>
              </label>
              <select
                id="subService"
                value={subService}
                onChange={(e) => setSubService(e.target.value)}
                className="w-full text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg px-3 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {currentServiceDef.subServices.map((sub, idx) => (
                  <option key={idx} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Urgency / Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Standard', 'Urgent', 'Tatkal'] as PriorityLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPriority(level)}
                    className={`py-2 px-2 text-xs font-medium rounded-lg border transition-all text-center cursor-pointer ${
                      priority === level
                        ? level === 'Tatkal'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200/80 pt-5">
            <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-3">
              2. Customer Personal Information
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                    }}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.fullName
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-neutral-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: '' }));
                    }}
                    placeholder="e.g. +91 70996 26706"
                    className={`w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.phoneNumber
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-neutral-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Date of Birth & Automated Age Calculation */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="dob" className="block text-xs font-semibold text-neutral-700">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-neutral-400">
                    Calculates age automatically
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="dob"
                    type="date"
                    value={dob}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={handleDobChange}
                    className={`w-full text-xs sm:text-sm px-3 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.dob
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-neutral-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.dob && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.dob}</p>
                )}
              </div>

              {/* Automatic Age Calculation Display Box */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Age (Computed Automatically)
                </label>
                <div className="flex items-center justify-between px-3 py-2.5 bg-white border border-neutral-300 rounded-lg min-h-[42px]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">Age:</span>
                    {calculatedAge !== null ? (
                      <span className="font-mono tabular-nums font-bold text-sm text-blue-700">
                        {calculatedAge} {calculatedAge === 1 ? 'Year' : 'Years'}
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400 italic">
                        Select DOB to calculate
                      </span>
                    )}
                  </div>
                  {ageDisplay && (
                    <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                      {ageDisplay}
                    </span>
                  )}
                </div>
                {calculatedAge !== null && calculatedAge < 18 && (
                  <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>Minor (&lt;18). Guardian ID may be required for passport/rail.</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Service Specific Journey / Application Details */}
          <div className="border-t border-neutral-200/80 pt-5">
            <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-3">
              3. Service Details & Preferences
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="targetDate" className="block text-xs font-medium text-neutral-700 mb-1">
                  Target Date / Journey Date
                </label>
                <input
                  id="targetDate"
                  type="date"
                  value={journeyOrTargetDate}
                  onChange={(e) => setJourneyOrTargetDate(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="sourceCity" className="block text-xs font-medium text-neutral-700 mb-1">
                  {selectedService === 'passport' ? 'Nearest PSK Office' : selectedService === 'driving_license' ? 'RTO Location' : selectedService === 'job_application' ? 'Exam / Post Name' : 'From / Origin'}
                </label>
                <input
                  id="sourceCity"
                  type="text"
                  value={sourceCity}
                  onChange={(e) => setSourceCity(e.target.value)}
                  placeholder={selectedService === 'railway' ? 'e.g. Silchar / Guwahati' : selectedService === 'flight' ? 'e.g. IXS / CCU' : 'Enter detail'}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="destinationCity" className="block text-xs font-medium text-neutral-700 mb-1">
                  {selectedService === 'passport' ? 'Jurisdiction' : selectedService === 'driving_license' ? 'Vehicle Class' : selectedService === 'job_application' ? 'Govt Board / Agency' : 'To / Destination'}
                </label>
                <input
                  id="destinationCity"
                  type="text"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  placeholder={selectedService === 'railway' ? 'e.g. New Delhi' : selectedService === 'flight' ? 'e.g. Bangalore' : 'Enter destination'}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="notes" className="block text-xs font-medium text-neutral-700 mb-1">
                Additional Instructions / Seat or Berth Preference / Document Status
              </label>
              <textarea
                id="notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention train numbers, berth preferences (Lower/Side Lower), passport booklet type (36/60 pages), or exam portal links..."
                className="w-full text-xs sm:text-sm p-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Submit Action and Terms */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-500 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>Records are securely stored in your browser and ready for processing.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Submit Booking Request</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
