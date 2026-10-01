import React, { useState, useEffect } from 'react';
import { X, User, Phone, AlertCircle, Save, Plus } from 'lucide-react';
import { calculateAge, formatAgeDescription } from '../utils/ageCalculator';
import { SERVICES_CONFIG, generateBookingId } from '../utils/storage';
import { CustomerRecord, CustomerStatus, PriorityLevel, ServiceCategory } from '../types/booking';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: CustomerRecord) => void;
  customerToEdit?: CustomerRecord | null;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  customerToEdit
}) => {
  const isEditing = Boolean(customerToEdit);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [service, setService] = useState<ServiceCategory>('railway');
  const [subService, setSubService] = useState('');
  const [status, setStatus] = useState<CustomerStatus>('Pending');
  const [priority, setPriority] = useState<PriorityLevel>('Standard');
  const [journeyOrTargetDate, setJourneyOrTargetDate] = useState('');
  const [sourceCity, setSourceCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentServiceDef = SERVICES_CONFIG.find(s => s.id === service) || SERVICES_CONFIG[0];

  useEffect(() => {
    if (customerToEdit) {
      setFullName(customerToEdit.fullName);
      setPhoneNumber(customerToEdit.phoneNumber);
      setDob(customerToEdit.dob);
      setCalculatedAge(customerToEdit.age ?? calculateAge(customerToEdit.dob));
      setService(customerToEdit.service);
      setSubService(customerToEdit.subService);
      setStatus(customerToEdit.status);
      setPriority(customerToEdit.priority);
      setJourneyOrTargetDate(customerToEdit.journeyOrTargetDate || '');
      setSourceCity(customerToEdit.sourceCity || '');
      setDestinationCity(customerToEdit.destinationCity || '');
      setNotes(customerToEdit.notes || '');
      setErrors({});
    } else {
      // New Customer Defaults
      setFullName('');
      setPhoneNumber('');
      setDob('');
      setCalculatedAge(null);
      setService('railway');
      setSubService(SERVICES_CONFIG[0].subServices[0]);
      setStatus('Pending');
      setPriority('Standard');
      setJourneyOrTargetDate('');
      setSourceCity('');
      setDestinationCity('');
      setNotes('');
      setErrors({});
    }
  }, [customerToEdit, isOpen]);

  // Update sub-service list when service changes in modal
  const handleServiceChange = (newService: ServiceCategory) => {
    setService(newService);
    const def = SERVICES_CONFIG.find(s => s.id === newService);
    if (def && def.subServices.length > 0) {
      setSubService(def.subServices[0]);
    }
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);
    if (!val) {
      setCalculatedAge(null);
      setErrors(prev => ({ ...prev, dob: '' }));
      return;
    }

    const birthDate = new Date(val);
    const today = new Date();
    if (birthDate > today) {
      setErrors(prev => ({ ...prev, dob: 'Date of birth cannot be in the future' }));
      setCalculatedAge(null);
      return;
    }

    setErrors(prev => ({ ...prev, dob: '' }));
    setCalculatedAge(calculateAge(val));
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Customer name is required';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!dob) newErrors.dob = 'Date of birth is required';
    if (calculatedAge === null) newErrors.dob = 'Valid date of birth required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const recordToSave: CustomerRecord = {
      id: customerToEdit ? customerToEdit.id : generateBookingId(),
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      dob,
      age: calculatedAge ?? calculateAge(dob),
      service,
      subService: subService || currentServiceDef.subServices[0],
      status,
      priority,
      journeyOrTargetDate: journeyOrTargetDate || undefined,
      sourceCity: sourceCity.trim() || undefined,
      destinationCity: destinationCity.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: customerToEdit ? customerToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(recordToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl w-full max-w-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              {isEditing ? `Edit Customer Record: ${customerToEdit?.id}` : 'Add New Customer Record'}
            </h3>
            <p className="text-xs text-neutral-500">
              {isEditing ? 'Update customer information and booking status' : 'Enter customer details and select requested service'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Customer Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ananya Singha"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 70996 26706"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phoneNumber && <p className="text-[11px] text-red-500 mt-1">{errors.phoneNumber}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dob}
                max={new Date().toISOString().split('T')[0]}
                onChange={handleDobChange}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.dob && <p className="text-[11px] text-red-500 mt-1">{errors.dob}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Age (Auto-Calculated from DOB)
              </label>
              <div className="px-3 py-2 bg-neutral-100 border border-neutral-300 rounded-lg flex items-center justify-between text-xs sm:text-sm">
                <span className="font-mono tabular-nums font-semibold text-neutral-900">
                  {calculatedAge !== null ? `${calculatedAge} years` : 'Enter DOB to calculate'}
                </span>
                {dob && (
                  <span className="text-[11px] text-neutral-500 font-medium">
                    {formatAgeDescription(dob)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Primary Service
              </label>
              <select
                value={service}
                onChange={(e) => handleServiceChange(e.target.value as ServiceCategory)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SERVICES_CONFIG.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Service Option / Sub-Type
              </label>
              <select
                value={subService}
                onChange={(e) => setSubService(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currentServiceDef.subServices.map((sub, i) => (
                  <option key={i} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Booking Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CustomerStatus)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="Pending">Pending (New Request)</option>
                <option value="In Progress">In Progress (Processing)</option>
                <option value="Confirmed">Confirmed (Booked / Scheduled)</option>
                <option value="Completed">Completed (Final Delivery)</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Standard">Standard</option>
                <option value="Urgent">Urgent</option>
                <option value="Tatkal">Tatkal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Target / Journey Date
              </label>
              <input
                type="date"
                value={journeyOrTargetDate}
                onChange={(e) => setJourneyOrTargetDate(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Origin / PSK / RTO
              </label>
              <input
                type="text"
                value={sourceCity}
                onChange={(e) => setSourceCity(e.target.value)}
                placeholder="e.g. Silchar"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Destination / Board
              </label>
              <input
                type="text"
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                placeholder="e.g. New Delhi"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Internal Notes & Document Details
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. PNR number, seat preference, token time at PSK, exam challan reference..."
              className="w-full text-xs sm:text-sm p-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isEditing ? 'Save Changes' : 'Add Customer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
