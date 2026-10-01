import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Phone,
  Edit2,
  Trash2,
  FileSpreadsheet,
  Download,
  Upload,
  RefreshCw,
  FileText,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Train,
  Plane,
  Bus,
  BookUser,
  IdCard,
  Briefcase,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { CustomerRecord, CustomerStatus, PriorityLevel, ServiceCategory, BusinessConfig } from '../types/booking';
import { SERVICES_CONFIG, exportCustomersToCSV, exportCustomersToJSON, INITIAL_CUSTOMERS } from '../utils/storage';

interface CustomerManagementProps {
  customers: CustomerRecord[];
  onAddCustomer: () => void;
  onEditCustomer: (customer: CustomerRecord) => void;
  onDeleteCustomer: (customer: CustomerRecord) => void;
  onViewReceipt: (customer: CustomerRecord) => void;
  onUpdateStatus: (customerId: string, newStatus: CustomerStatus) => void;
  onResetSampleData: () => void;
  onImportCustomers: (importedList: CustomerRecord[]) => void;
  businessConfig: BusinessConfig;
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({
  customers,
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onViewReceipt,
  onUpdateStatus,
  onResetSampleData,
  onImportCustomers,
  businessConfig
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'name-asc' | 'age-asc' | 'age-desc'>('date-desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filter and search logic
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      // Status filter
      if (selectedStatus !== 'All' && c.status !== selectedStatus) {
        return false;
      }
      // Service filter
      if (selectedService !== 'All' && c.service !== selectedService) {
        return false;
      }
      // Search query across multiple fields
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = c.fullName.toLowerCase().includes(query);
        const matchesPhone = c.phoneNumber.includes(query);
        const matchesId = c.id.toLowerCase().includes(query);
        const matchesSubService = c.subService.toLowerCase().includes(query);
        const matchesNotes = (c.notes || '').toLowerCase().includes(query);
        const matchesCities = (c.sourceCity || '').toLowerCase().includes(query) || (c.destinationCity || '').toLowerCase().includes(query);

        if (!matchesName && !matchesPhone && !matchesId && !matchesSubService && !matchesNotes && !matchesCities) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'name-asc') {
        return a.fullName.localeCompare(b.fullName);
      }
      if (sortBy === 'age-asc') {
        return a.age - b.age;
      }
      if (sortBy === 'age-desc') {
        return b.age - a.age;
      }
      return 0;
    });
  }, [customers, searchQuery, selectedStatus, selectedService, sortBy]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = customers.length;
    const pending = customers.filter(c => c.status === 'Pending').length;
    const inProgress = customers.filter(c => c.status === 'In Progress').length;
    const confirmed = customers.filter(c => c.status === 'Confirmed').length;
    const completed = customers.filter(c => c.status === 'Completed').length;
    const tatkalUrgent = customers.filter(c => c.priority === 'Tatkal' || c.priority === 'Urgent').length;

    return { total, pending, inProgress, confirmed, completed, tatkalUrgent };
  }, [customers]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportCustomers(parsed);
          } else {
            alert('Invalid backup file format');
          }
        } catch (err) {
          alert('Failed to parse backup JSON file');
        }
      };
    }
  };

  const getServiceIcon = (service: ServiceCategory) => {
    switch (service) {
      case 'railway': return <Train className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
      case 'flight': return <Plane className="w-3.5 h-3.5 text-sky-600 shrink-0" />;
      case 'bus': return <Bus className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      case 'passport': return <BookUser className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case 'driving_license': return <IdCard className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
      case 'job_application': return <Briefcase className="w-3.5 h-3.5 text-purple-600 shrink-0" />;
    }
  };

  const getStatusBadge = (status: CustomerStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Completed':
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-800 border-red-200';
    }
  };

  return (
    <div className="py-8 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header & Quick Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <span className="font-semibold text-neutral-800">Admin & Agent Desk</span>
              <span aria-hidden="true">·</span>
              <span>💾 Saved In Browser (localStorage)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight mt-0.5">
              Customer Booking Records
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Manage client details, real-time age verification, status tracking, and direct telephone contact.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onAddCustomer}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>

            <button
              type="button"
              onClick={() => exportCustomersToCSV(customers)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg transition-colors cursor-pointer"
              title="Download Excel CSV file"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => exportCustomersToJSON(customers)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg transition-colors cursor-pointer"
              title="Download complete JSON backup"
            >
              <Download className="w-4 h-4 text-neutral-600" />
              <span className="hidden sm:inline">Backup</span>
            </button>

            <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg transition-colors cursor-pointer">
              <Upload className="w-4 h-4 text-neutral-600" />
              <span className="hidden sm:inline">Restore</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={onResetSampleData}
              className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors cursor-pointer"
              title="Reset to default sample records"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-neutral-200/90 shadow-2xs">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
              Total Records
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-bold font-mono tabular-nums text-neutral-900">
                {stats.total}
              </span>
              <span className="text-[11px] text-neutral-400">All Time</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/20 shadow-2xs">
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
              Pending Action
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-bold font-mono tabular-nums text-amber-700">
                {stats.pending}
              </span>
              <span className="text-[11px] text-amber-600">Need Call</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-blue-200/80 bg-blue-50/20 shadow-2xs">
            <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">
              In Progress
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-bold font-mono tabular-nums text-blue-700">
                {stats.inProgress}
              </span>
              <span className="text-[11px] text-blue-600">Processing</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-emerald-200/80 bg-emerald-50/20 shadow-2xs">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
              Confirmed
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-bold font-mono tabular-nums text-emerald-700">
                {stats.confirmed}
              </span>
              <span className="text-[11px] text-emerald-600">Ready</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
              Completed
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-bold font-mono tabular-nums text-neutral-800">
                {stats.completed}
              </span>
              <span className="text-[11px] text-neutral-400">Delivered</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-red-200/80 bg-red-50/20 shadow-2xs">
            <span className="text-[11px] font-semibold text-red-700 uppercase tracking-wider block">
              Tatkal / Urgent
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-bold font-mono tabular-nums text-red-700">
                {stats.tatkalUrgent}
              </span>
              <span className="text-[11px] text-red-600">High Priority</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name, phone number (+91...), booking ID, destination..."
                className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-neutral-50/70 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-xs text-neutral-400 hover:text-neutral-700 px-1.5 py-0.5 rounded"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort & View Switcher */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full text-xs bg-white border border-neutral-300 rounded-lg px-2.5 py-2.5 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="age-asc">Age (Youngest)</option>
                  <option value="age-desc">Age (Eldest)</option>
                </select>
              </div>

              {/* Table / Card view toggle */}
              <div className="flex items-center p-1 bg-neutral-100 rounded-lg border border-neutral-200">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    viewMode === 'table' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Table
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    viewMode === 'cards' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>

          {/* Status Filter Segmented Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-neutral-100">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mr-1">
              Status:
            </span>
            {['All', 'Pending', 'In Progress', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Service Filter Segmented Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mr-1">
              Service:
            </span>
            <button
              type="button"
              onClick={() => setSelectedService('All')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedService === 'All'
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All Services
            </button>
            {SERVICES_CONFIG.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedService(s.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                  selectedService === s.id
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {getServiceIcon(s.id)}
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Customer Records List / Table */}
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800">No customer records match your filter</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Try changing your search keywords, clear the status filters, or add a new customer booking record.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('All');
                  setSelectedService('All');
                }}
                className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
              >
                Clear All Filters
              </button>
              <button
                type="button"
                onClick={onAddCustomer}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                + Add Customer
              </button>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          /* High-Density Desktop Data Table */
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50/90 text-neutral-600 font-semibold border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Customer Name & Phone</th>
                    <th className="py-3 px-4">DOB & Age</th>
                    <th className="py-3 px-4">Service & Requirement</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredCustomers.map((cust) => (
                    <tr
                      key={cust.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      {/* Booking ID */}
                      <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-neutral-900 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onViewReceipt(cust)}
                          className="hover:text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                          title="View official customer booking slip"
                        >
                          <span>{cust.id}</span>
                          <FileText className="w-3 h-3 text-neutral-400 group-hover:text-blue-600" />
                        </button>
                      </td>

                      {/* Customer Name & Phone with Direct Call */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-900">{cust.fullName}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <a
                            href={`tel:${cust.phoneNumber.replace(/\s+/g, '')}`}
                            className="font-mono tabular-nums text-neutral-600 hover:text-blue-600 flex items-center gap-1 text-[11px] group-hover:text-blue-700"
                            title="Direct Phone Call to Customer"
                          >
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{cust.phoneNumber}</span>
                          </a>
                        </div>
                      </td>

                      {/* DOB & Computed Age */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono tabular-nums font-bold text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded text-[11px]">
                            {cust.age} yrs
                          </span>
                          {cust.age < 18 && (
                            <span className="text-[10px] text-amber-700 font-semibold">
                              Minor
                            </span>
                          )}
                        </div>
                        <div className="font-mono tabular-nums text-[11px] text-neutral-400 mt-0.5">
                          {cust.dob}
                        </div>
                      </td>

                      {/* Service & Sub-service */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                          {getServiceIcon(cust.service)}
                          <span className="truncate">{cust.subService}</span>
                        </div>
                        {(cust.sourceCity || cust.destinationCity) && (
                          <div className="text-[11px] text-neutral-500 mt-0.5 truncate">
                            {cust.sourceCity || 'Start'} &rarr; {cust.destinationCity || 'End'}
                            {cust.journeyOrTargetDate && ` (${cust.journeyOrTargetDate})`}
                          </div>
                        )}
                        {cust.notes && (
                          <div className="text-[11px] text-neutral-400 truncate italic mt-0.5" title={cust.notes}>
                            {cust.notes}
                          </div>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                          cust.priority === 'Tatkal'
                            ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                            : cust.priority === 'Urgent'
                            ? 'bg-red-50 text-red-800 border-red-200 font-semibold'
                            : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                        }`}>
                          {cust.priority}
                        </span>
                      </td>

                      {/* Quick Status Dropdown (1-Click Update) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={cust.status}
                          onChange={(e) => onUpdateStatus(cust.id, e.target.value as CustomerStatus)}
                          className={`text-xs font-semibold px-2 py-1 rounded-md border cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 ${getStatusBadge(
                            cust.status
                          )}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono tabular-nums text-neutral-500 text-[11px]">
                        {new Date(cust.createdAt).toLocaleDateString()}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onViewReceipt(cust)}
                            className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                            title="Print / View Customer Slip"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={`tel:${cust.phoneNumber.replace(/\s+/g, '')}`}
                            className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Direct Phone Call to Customer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => onEditCustomer(cust)}
                            className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                            title="Edit customer details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteCustomer(cust)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Delete customer record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Mobile Friendly Card Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => onViewReceipt(cust)}
                      className="font-mono tabular-nums text-xs font-bold text-neutral-900 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{cust.id}</span>
                      <FileText className="w-3 h-3 text-neutral-400" />
                    </button>
                    <select
                      value={cust.status}
                      onChange={(e) => onUpdateStatus(cust.id, e.target.value as CustomerStatus)}
                      className={`text-xs font-semibold px-2 py-0.5 rounded border cursor-pointer ${getStatusBadge(
                        cust.status
                      )}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900">{cust.fullName}</h3>

                  <div className="flex items-center gap-3 text-xs text-neutral-600 mt-1">
                    <span>
                      Age: <strong className="font-mono tabular-nums text-blue-700">{cust.age} yrs</strong>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{cust.dob}</span>
                  </div>

                  <div className="mt-3 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-neutral-800">
                      {getServiceIcon(cust.service)}
                      <span className="truncate">{cust.subService}</span>
                    </div>
                    {(cust.sourceCity || cust.destinationCity) && (
                      <div className="text-[11px] text-neutral-500 mt-1 truncate">
                        {cust.sourceCity} &rarr; {cust.destinationCity}
                      </div>
                    )}
                    {cust.journeyOrTargetDate && (
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        Date: <span className="font-mono tabular-nums">{cust.journeyOrTargetDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <a
                    href={`tel:${cust.phoneNumber.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="font-mono tabular-nums">{cust.phoneNumber}</span>
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onViewReceipt(cust)}
                      className="p-2 text-neutral-600 hover:text-blue-600 hover:bg-neutral-100 rounded-lg"
                      title="View Slip"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditCustomer(cust)}
                      className="p-2 text-neutral-600 hover:text-blue-600 hover:bg-neutral-100 rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCustomer(cust)}
                      className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Browser Storage Persistence Status Note */}
        <div className="flex items-center justify-between text-xs text-neutral-400 px-2 py-2">
          <span>
            💾 All customer additions, edits, and deletions persist locally in your browser storage.
          </span>
          <span className="font-mono tabular-nums">
            Showing {filteredCustomers.length} of {customers.length} records
          </span>
        </div>
      </div>
    </div>
  );
};
