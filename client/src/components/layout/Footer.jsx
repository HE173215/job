import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Star, MapPin, Phone, Mail, ExternalLink, ChevronRight } from 'lucide-react';
import Container from '../common/Container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-army-black text-army-ivory border-t border-army-gold/30 pt-16 pb-10 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-army-red/15 blur-3xl pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-army-gold/15">
          {/* Column 1: Organization Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-army-maroon border border-army-gold flex items-center justify-center text-army-gold shrink-0 shadow-gold-glow">
                <Star className="w-5 h-5 fill-army-gold" />
              </div>
              <div>
                <p className="text-[10px] text-army-gold font-serif uppercase tracking-widest font-semibold">
                  BỘ QUỐC PHÒNG
                </p>
                <h3 className="font-serif font-bold text-army-white text-base leading-tight">
                  TRƯỜNG SĨ QUAN CHÍNH TRỊ
                </h3>
              </div>
            </div>
            <p className="text-xs text-army-ivory/75 leading-relaxed">
              Trung tâm đào tạo sĩ quan chính trị cấp phân đội, bồi dưỡng cán bộ chính trị và nghiên cứu khoa học xã hội nhân văn quân sự của Quân đội nhân dân Việt Nam.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-army-maroon/60 border border-army-gold/20 text-[11px] text-army-gold">
                <Shield className="w-3.5 h-3.5" />
                <span>Chính quy – Chuẩn hóa – Hiện đại</span>
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

          {/* Column 3: Contact Info (Standard placeholder as per rule 7) */}
          <div>
            <h4 className="font-serif font-bold text-army-gold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-army-gold rotate-45" />
              Thông tin liên hệ
            </h4>
            <ul className="space-y-3 text-xs text-army-ivory/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-army-gold shrink-0 mt-0.5" />
                <span>Trụ sở chính: [Đang cập nhật địa chỉ chính thức theo văn bản]</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-army-gold shrink-0" />
                <span>Trực ban tác chiến: [Đang cập nhật số máy]</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-army-gold shrink-0" />
                <span>Thư điện tử: [congthongtin@sqct.bqp.vn - Mẫu]</span>
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

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 text-xs text-army-muted">
          <div>
            <p>© {currentYear} Bản quyền thuộc Trường Sĩ quan Chính trị – Bộ Quốc phòng.</p>
            <p className="text-[11px] text-army-muted/70 mt-0.5">
              Ghi rõ nguồn "Cổng Thông tin điện tử Trường Sĩ quan Chính trị" khi phát hành lại thông tin.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/contact" className="hover:text-army-gold transition-colors">
              Liên hệ
            </Link>
            <span className="text-army-gold/40">•</span>
            <span className="text-army-gold/80 font-serif">Kỷ luật – Danh dự – Trách nhiệm</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
