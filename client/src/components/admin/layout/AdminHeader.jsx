import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Menu, ExternalLink, LogOut, User as UserIcon, Shield } from 'lucide-react';

export function AdminHeader({ onOpenMobileMenu, pageTitle = 'Bảng Điều Khiển' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="h-16 bg-white border-b border-stone-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Left: Mobile Menu Trigger + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded text-stone-600 hover:text-[#410202] hover:bg-stone-100 transition-colors focus:outline-none"
          aria-label="Mở menu quản trị"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#D99C2B]" />
          <h1 className="text-base sm:text-lg font-serif font-bold text-[#241A18] tracking-wide">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: Quick Links & User Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Link to public site */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif font-semibold text-[#410202] bg-stone-100 hover:bg-[#410202] hover:text-white rounded transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Xem website</span>
        </Link>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-3 border-l border-stone-200">
          <div className="w-8 h-8 rounded-full bg-[#410202] text-[#D99C2B] border border-[#D99C2B]/40 flex items-center justify-center font-serif font-bold text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-[#241A18] leading-tight">
              {user?.name || user?.username || 'Cán bộ'}
            </span>
            <span className="text-[10px] text-stone-500 uppercase tracking-wider">
              {user?.role === 'admin' ? 'Quản trị viên' : 'Biên tập viên'}
            </span>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="p-2 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
          title="Đăng xuất"
          aria-label="Đăng xuất khỏi hệ thống"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
