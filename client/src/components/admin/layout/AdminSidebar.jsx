import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  LayoutDashboard,
  Clock,
  Newspaper,
  CalendarDays,
  Image as ImageIcon,
  ExternalLink,
  LogOut,
  Shield,
  Star,
} from 'lucide-react';

export const ADMIN_NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/history', label: 'Lịch sử truyền thống', icon: Clock },
  { to: '/admin/news', label: 'Tin tức & Bài viết', icon: Newspaper },
  { to: '/admin/activities', label: 'Hoạt động nổi bật', icon: CalendarDays },
  { to: '/admin/gallery', label: 'Thư viện ảnh', icon: ImageIcon },
];

export function AdminSidebar({ className = '', onItemClick }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (onItemClick) onItemClick();
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <aside
      className={`w-64 bg-[#410202] text-army-ivory flex flex-col justify-between border-r border-army-gold/30 shadow-xl ${className}`}
    >
      <div>
        {/* Brand Banner */}
        <div className="p-5 border-b border-army-gold/20 flex items-center gap-3 bg-army-black/30">
          <div className="w-10 h-10 rounded-full bg-army-black border border-army-gold flex items-center justify-center text-army-gold shadow-gold-glow shrink-0">
            <Star className="w-5 h-5 fill-army-gold" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] text-army-gold font-serif uppercase tracking-widest font-semibold truncate">
              BỘ QUỐC PHÒNG
            </span>
            <span className="text-xs font-serif font-extrabold text-army-white uppercase tracking-wider truncate">
              TRƯỜNG SQ CHÍNH TRỊ
            </span>
            <span className="text-[10px] text-army-gold-light/80 font-sans truncate">
              Hệ thống Quản trị CMS
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onItemClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-military text-xs sm:text-sm font-serif font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-[#D99C2B] text-[#410202] shadow-gold-glow font-extrabold'
                      : 'text-army-ivory/90 hover:text-army-gold hover:bg-army-black/40'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-4 border-t border-army-gold/20 bg-army-black/40 space-y-2">
        {/* User Info */}
        <div className="px-2 py-1.5 flex items-center gap-2.5 text-xs">
          <div className="w-7 h-7 rounded-full bg-army-gold text-army-maroon flex items-center justify-center font-serif font-bold shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-army-white font-bold truncate text-xs">
              {user?.name || user?.username || 'Cán bộ quản trị'}
            </p>
            <p className="text-[10px] text-army-gold/80 uppercase font-serif tracking-wider">
              {user?.role === 'admin' ? 'Quản trị viên' : 'Biên tập viên'}
            </p>
          </div>
        </div>

        {/* Public Website Link */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-sm text-xs font-semibold text-army-ivory/80 hover:text-army-gold hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Xem website</span>
          </span>
          <span className="text-[10px] bg-army-gold/20 text-army-gold px-1.5 py-0.5 rounded">
            Public
          </span>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-semibold text-red-300 hover:text-red-100 hover:bg-red-950/50 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
