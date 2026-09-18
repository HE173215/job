import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, Shield, ChevronRight } from 'lucide-react';

export function MobileMenu({ isOpen, onClose, navLinks }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-gradient-to-b from-army-black via-army-maroon to-army-black border-l border-army-gold/30 p-6 flex flex-col justify-between shadow-2xl z-10">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-army-gold/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-army-gold/20 border border-army-gold flex items-center justify-center text-army-gold">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-army-gold text-sm tracking-wider">
                TRƯỜNG SQ CHÍNH TRỊ
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-sm text-army-ivory hover:text-army-gold hover:bg-white/5 transition-colors"
              aria-label="Đóng menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-military text-sm font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-army-gold text-army-maroon shadow-gold-glow'
                      : 'text-army-ivory hover:text-army-gold hover:bg-army-maroon/60'
                  }`
                }
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-army-gold/20 text-center">
          <p className="text-xs text-army-gold font-serif uppercase tracking-widest mb-1">
            Bộ Quốc Phòng
          </p>
          <p className="text-[11px] text-army-muted">
            Bản quyền © {new Date().getFullYear()} Trường Sĩ quan Chính trị
          </p>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
