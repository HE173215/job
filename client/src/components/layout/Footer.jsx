import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import Container from '../common/Container';
import { useAuth } from '../../contexts/AuthContext';
import siteSettingsService, {
  SETTINGS_UPDATED_EVENT,
  DEFAULT_SITE_SETTINGS,
} from '../../services/siteSettingsService';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated, user } = useAuth();
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    // Lấy cấu hình ban đầu
    setSettings(siteSettingsService.getSettings());

    // Đăng ký lắng nghe sự kiện khi quản trị viên cập nhật cài đặt
    const handleSettingsUpdate = (e) => {
      if (e.detail) setSettings(e.detail);
    };

    window.addEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
    return () => window.removeEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
  }, []);

  return (
    <footer className="bg-army-black text-army-ivory border-t border-army-gold/30 pt-16 pb-10 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-army-red/15 blur-3xl pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-army-gold/15">
          {/* Column 1: Organization Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full p-0.5 bg-army-maroon border border-army-gold flex items-center justify-center text-army-gold shrink-0 shadow-gold-glow overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Logo Trường Sĩ quan Chính trị"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-[10px] text-army-gold font-serif uppercase tracking-widest font-semibold">
                  {settings.subOrgName || 'BỘ QUỐC PHÒNG'}
                </p>
                <h3 className="font-serif font-bold text-army-white text-base leading-tight">
                  {settings.orgName || 'TRƯỜNG SĨ QUAN CHÍNH TRỊ'}
                </h3>
              </div>
            </div>
            <p className="text-xs text-army-ivory/75 leading-relaxed">
              {settings.introSummary}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-army-maroon/60 border border-army-gold/20 text-[11px] text-army-gold">
                <Shield className="w-3.5 h-3.5" />
                <span>{settings.motto}</span>
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="font-serif font-bold text-army-gold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-army-gold rotate-45" />
              Điều hướng chính
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { to: '/', label: 'Trang chủ' },
                { to: '/history', label: 'Lịch sử – Truyền thống vẻ vang' },
                { to: '/battalions', label: 'Các đơn vị Tiểu đoàn' },
                { to: '/introduction', label: 'Giới thiệu chung' },
                { to: '/news', label: 'Tin tức & Sự kiện' },
                { to: '/activities', label: 'Hoạt động nổi bật' },
                { to: '/gallery', label: 'Thư viện tư liệu ảnh' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-center gap-1.5 text-army-ivory/80 hover:text-army-gold hover:translate-x-1 transition-all"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-army-gold/60" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info (Tùy biến qua Admin Settings) */}
          <div>
            <h4 className="font-serif font-bold text-army-gold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-army-gold rotate-45" />
              Thông tin liên hệ
            </h4>
            <ul className="space-y-3 text-xs text-army-ivory/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-army-gold shrink-0 mt-0.5" />
                <span>Trụ sở chính: {settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-army-gold shrink-0" />
                <span>{settings.hotline}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-army-gold shrink-0" />
                <span>Thư điện tử: {settings.email}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: External Military Portals */}
          <div>
            <h4 className="font-serif font-bold text-army-gold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-army-gold rotate-45" />
              Cổng thông tin liên kết
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { label: 'Cổng TTĐT Bộ Quốc phòng', href: 'http://mod.gov.vn' },
                { label: 'Báo Quân đội nhân dân', href: 'https://qdnd.vn' },
                { label: 'Tạp chí Quốc phòng toàn dân', href: 'http://tapchiquocphongtoandan.vn' },
                { label: 'Trung tâm Phát thanh - Truyền hình Quân đội', href: 'http://qpvn.vn' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-army-ivory/80 hover:text-army-gold transition-colors py-0.5 border-b border-white/5 group"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:text-army-gold transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Security / Regulatory Note at Bottom */}
        {settings.securityNote && (
          <div className="py-3 px-4 my-6 rounded bg-army-dark/60 border border-army-gold/20 text-center text-[11px] text-army-muted leading-relaxed">
            {settings.securityNote}
          </div>
        )}

        {/* Bottom Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 text-xs text-army-muted">
          <div>
            <p>© {currentYear} {settings.copyright}</p>
            <p className="text-[11px] text-army-muted/70 mt-0.5">
              {settings.citationNote}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/contact" className="hover:text-army-gold transition-colors">
              Liên hệ
            </Link>
            <span className="text-army-gold/40">•</span>
            <span className="text-army-gold/80 font-serif font-semibold">
              {settings.slogan}
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
