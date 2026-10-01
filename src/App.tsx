/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { HeroSection } from './components/HeroSection';
import { ServicesGrid } from './components/ServicesGrid';
import { BookingForm } from './components/BookingForm';
import { CustomerManagement } from './components/CustomerManagement';
import { CustomerModal } from './components/CustomerModal';
import { BookingReceiptModal } from './components/BookingReceiptModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SettingsModal } from './components/SettingsModal';
import { DirectCallBar } from './components/DirectCallBar';
import { FooterSection } from './components/FooterSection';
import { 
  getStoredCustomers, 
  saveCustomers, 
  getStoredBusinessConfig, 
  saveBusinessConfig, 
  INITIAL_CUSTOMERS 
} from './utils/storage';
import { CustomerRecord, CustomerStatus, ServiceCategory, BusinessConfig } from './types/booking';

export default function App() {
  const [activeTab, setActiveTab] = useState<'portal' | 'management'>('portal');
  const [customers, setCustomers] = useState<CustomerRecord[]>(() => getStoredCustomers());
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>(() => getStoredBusinessConfig());
  const [selectedService, setSelectedService] = useState<ServiceCategory>('railway');

  // Modals state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<CustomerRecord | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerRecord | null>(null);
  const [receiptCustomer, setReceiptCustomer] = useState<CustomerRecord | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync customers to localStorage whenever state updates
  useEffect(() => {
    saveCustomers(customers);
  }, [customers]);

  // Sync config to localStorage
  useEffect(() => {
    saveBusinessConfig(businessConfig);
  }, [businessConfig]);

  const handleSelectServiceFromGrid = (serviceId: ServiceCategory) => {
    setSelectedService(serviceId);
    if (activeTab !== 'portal') {
      setActiveTab('portal');
    }
    // Smooth scroll to booking form
    setTimeout(() => {
      const el = document.getElementById('booking-form-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleScrollToBookingForm = () => {
    if (activeTab !== 'portal') {
      setActiveTab('portal');
    }
    setTimeout(() => {
      const el = document.getElementById('booking-form-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleSubmitNewBooking = (newCustomer: CustomerRecord) => {
    setCustomers(prev => [newCustomer, ...prev]);
  };

  const handleSaveCustomerModal = (record: CustomerRecord) => {
    setCustomers(prev => {
      const existsIndex = prev.findIndex(c => c.id === record.id);
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = record;
        return copy;
      } else {
        return [record, ...prev];
      }
    });
  };

  const handleDeleteConfirmed = () => {
    if (customerToDelete) {
      setCustomers(prev => prev.filter(c => c.id !== customerToDelete.id));
      setCustomerToDelete(null);
    }
  };

  const handleUpdateStatus = (customerId: string, newStatus: CustomerStatus) => {
    setCustomers(prev =>
      prev.map(c =>
        c.id === customerId
          ? { ...c, status: newStatus, updatedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const handleResetSampleData = () => {
    if (window.confirm('Reset all records to standard sample customer data?')) {
      setCustomers(INITIAL_CUSTOMERS);
    }
  };

  const handleImportCustomers = (importedList: CustomerRecord[]) => {
    setCustomers(importedList);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      {/* 3-Zone Top Bar Navigation Contract */}
      <TopNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        businessConfig={businessConfig}
        customerCount={customers.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'portal' ? (
          <div>
            {/* Hero Section with High-Fidelity Visual Anchor */}
            <HeroSection
              businessConfig={businessConfig}
              onBookNowClick={handleScrollToBookingForm}
              onViewRecordsClick={() => setActiveTab('management')}
            />

            {/* 6 Core Services Grid with Interactive Selection */}
            <ServicesGrid onSelectService={handleSelectServiceFromGrid} />

            {/* Customer Information & Service Submission Form */}
            <BookingForm
              selectedService={selectedService}
              onSelectService={setSelectedService}
              onSubmitBooking={handleSubmitNewBooking}
              primaryPhone={businessConfig.primaryPhone}
            />
          </div>
        ) : (
          /* Customer Management Dashboard */
          <CustomerManagement
            customers={customers}
            onAddCustomer={() => {
              setCustomerToEdit(null);
              setIsCustomerModalOpen(true);
            }}
            onEditCustomer={(c) => {
              setCustomerToEdit(c);
              setIsCustomerModalOpen(true);
            }}
            onDeleteCustomer={(c) => setCustomerToDelete(c)}
            onViewReceipt={(c) => setReceiptCustomer(c)}
            onUpdateStatus={handleUpdateStatus}
            onResetSampleData={handleResetSampleData}
            onImportCustomers={handleImportCustomers}
            businessConfig={businessConfig}
          />
        )}
      </main>

      {/* Direct Helpline & WhatsApp Floating Bar */}
      <DirectCallBar businessConfig={businessConfig} />

      {/* Comprehensive Footer Section */}
      <FooterSection
        businessConfig={businessConfig}
        onSelectService={handleSelectServiceFromGrid}
        onOpenManagement={() => setActiveTab('management')}
      />

      {/* Add / Edit Customer Modal */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => {
          setIsCustomerModalOpen(false);
          setCustomerToEdit(null);
        }}
        onSave={handleSaveCustomerModal}
        customerToEdit={customerToEdit}
      />

      {/* Printable Booking Receipt Slip Modal */}
      <BookingReceiptModal
        customer={receiptCustomer}
        businessConfig={businessConfig}
        onClose={() => setReceiptCustomer(null)}
      />

      {/* Delete Customer Confirmation Modal */}
      <DeleteConfirmModal
        customer={customerToDelete}
        isOpen={Boolean(customerToDelete)}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleDeleteConfirmed}
      />

      {/* Business Settings & Helpline Configuration Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        config={businessConfig}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(newCfg) => setBusinessConfig(newCfg)}
      />
    </div>
  );
}
