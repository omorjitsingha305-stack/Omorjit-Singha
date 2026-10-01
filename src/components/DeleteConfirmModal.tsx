import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { CustomerRecord } from '../types/booking';

interface DeleteConfirmModalProps {
  customer: CustomerRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  customer,
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-full bg-red-100 text-red-600 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Delete Customer Record?
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-neutral-900">{customer.fullName}</strong> ({customer.id})? This action cannot be undone.
              </p>
              <div className="mt-3 p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-600">
                <div>Service: <strong className="text-neutral-800">{customer.subService}</strong></div>
                <div>Phone: <span className="font-mono tabular-nums text-neutral-800">{customer.phoneNumber}</span></div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Record</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
