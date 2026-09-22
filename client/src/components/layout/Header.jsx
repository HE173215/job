import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Star } from 'lucide-react';
import Container from '../common/Container';
import MobileMenu from './MobileMenu';

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ' },
  { to: '/introduction', label: 'Giới thiệu' },
  { to: '/history', label: 'Lịch sử – Truyền thống' },
  { to: '/news', label: 'Tin tức' },
  { to: '/battalions', label: 'Đơn vị Tiểu đoàn' },
  { to: '/activities', label: 'Hoạt động' },
  { to: '/gallery', label: 'Thư viện ảnh' },
  { to: '/contact', label: 'Liên hệ' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-army-black/95 backdrop-blur-md shadow-2xl py-2.5 border-b border-army-gold/40'
            : 'bg-army-black/90 backdrop-blur-sm py-3 border-b border-army-gold/25'
        }`}
      >
        <Container className="flex items-center justify-between gap-4">
          {/* Logo & School Name */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus:ring-1 focus:ring-army-gold/50 rounded-sm shrink-0 select-none"
          >
            {/* Authentic School Logo */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-br from-army-gold/40 via-army-red to-army-maroon border border-army-gold/70 flex items-center justify-center shadow-gold-glow group-hover:scale-105 group-hover:border-army-gold transition-all shrink-0 overflow-hidden">
              <img
                src="/logo.png"
                alt="Logo Trường Sĩ quan Chính trị"
                className="w-full h-full object-contain"
              />
            </div>

            {/* School Title */}
            <div className="flex flex-col shrink-0">
              <span className="text-[9px] sm:text-[10px] xl:text-xs text-army-gold font-serif uppercase tracking-widest font-semibold whitespace-nowrap">
                BỘ QUỐC PHÒNG
              </span>
              <span className="text-xs sm:text-sm lg:text-sm xl:text-base font-serif font-bold text-army-white group-hover:text-army-gold transition-colors tracking-wider leading-tight whitespace-nowrap">
                TRƯỜNG SĨ QUAN CHÍNH TRỊ
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-2 shrink-0">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-2 lg:px-2.5 xl:px-3 py-1.5 rounded-sm text-xs xl:text-sm font-serif font-bold uppercase tracking-wider transition-all duration-200 relative group whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-army-gold'
                      : 'text-army-ivory/90 hover:text-army-gold-light'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="whitespace-nowrap">{link.label}</span>
                    {/* Active underline indicator */}
                    <span
                      className={`absolute bottom-0 left-1.5 right-1.5 h-0.5 bg-army-gold transition-transform duration-300 origin-center ${
                        isActive
                          ? 'scale-x-100 shadow-[0_0_8px_rgba(217,156,43,0.8)]'
                          : 'scale-x-0 group-hover:scale-x-75 bg-army-gold/60'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 sm:p-2 rounded-military text-army-gold border border-army-gold/40 hover:border-army-gold hover:bg-army-gold/10 transition-colors focus:outline-none focus:ring-2 focus:ring-army-gold/60"
              aria-label="Mở menu điều hướng"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navLinks={NAV_LINKS}
      />
    </>
  );
}

export default Header;
