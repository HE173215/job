import React from 'react';
import { X } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

export function AdminMobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full z-10 flex">
        <AdminSidebar className="h-full w-full" onItemClick={onClose} />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:text-[#D99C2B] focus:outline-none"
          aria-label="Đóng menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default AdminMobileMenu;
