import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Compass, ShieldCheck } from 'lucide-react';
import Container from '../common/Container';
import eraService from '../../services/eraService';

export function HistoryIntro({ eras: propEras, milestones = [] }) {
  const [eras, setEras] = useState(propEras || []);

  useEffect(() => {
    if (propEras && propEras.length > 0) {
      setEras(propEras);
      return;
    }

    let isMounted = true;
    eraService.getEras().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setEras(data);
      }
    });

    const handleEraUpdate = (event) => {
      if (isMounted && Array.isArray(event.detail)) {
        setEras(event.detail);
      }
    };

    window.addEventListener('era-updated', handleEraUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('era-updated', handleEraUpdate);
    };
  }, [propEras]);

  const eraCount = eras?.length || 0;
  const eraBadge = eraCount > 0 ? String(eraCount).padStart(2, '0') : '04';
  const startYear = eras[0]?.startYear
    ? String(eras[0].startYear)
    : milestones[0]?.year
    ? String(milestones[0].year)
    : '1951';

  return (
    <section id="history-intro" className="py-20 bg-dark-section relative border-b border-army-gold/20">
      <Container>
        {/* Archival Framed Box */}
        <div className="relative p-6 sm:p-10 md:p-12 rounded-military bg-army-maroon/40 border border-army-gold/30 shadow-card-dark backdrop-blur-sm">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-army-gold/60" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-army-gold/60" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-army-gold/60" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-army-gold/60" />

          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-army-gold font-serif font-bold">
              TỔNG QUAN HÀNH TRÌNH
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-army-white mt-2 mb-4">
              NƠI ƯƠM MẦM NHỮNG NGỌN CỜ TƯ TƯỞNG
            </h2>
            <p className="text-army-ivory/85 text-sm sm:text-base leading-relaxed">
              Trải qua các chặng đường lịch sử đồng hành cùng sự nghiệp giải phóng dân tộc, bảo vệ Tổ quốc và kiến thiết đất nước, Trường Sĩ quan Chính trị luôn khẳng định vị thế trung tâm giáo dục đào tạo, bồi dưỡng đội ngũ cán bộ chính trị kiên định, mẫu mực, là linh hồn của các cơ quan, đơn vị trong toàn quân.
            </p>
          </div>

          {/* 4 Pillars / Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-army-gold/15">
            {[
              {
                icon: Award,
                badge: startYear,
                label: 'Khởi nguồn vẻ vang',
                desc: 'Đặt nền móng đào tạo lý luận chính trị quân sự',
              },
              {
                icon: Compass,
                badge: eraBadge,
                label: 'Giai đoạn lịch sử',
                desc: 'Phát triển liên tục theo các mốc cách mạng trọng đại',
              },
              {
                icon: BookOpen,
                badge: 'Hàng vạn',
                label: 'Cán bộ chính trị',
                desc: 'Trưởng thành và cống hiến trên khắp mọi miền Tổ quốc',
              },
              {
                icon: ShieldCheck,
                badge: 'Trung hiếu',
                label: 'Bản lĩnh & Trách nhiệm',
                desc: 'Tuyệt đối trung thành với Đảng, Nhà nước và Nhân dân',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center p-4 rounded-military bg-army-black/40 border border-army-gold/15 hover:border-army-gold/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-army-maroon border border-army-gold/40 flex items-center justify-center text-army-gold mb-3 shadow-gold-glow">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-serif font-bold text-army-gold mb-1">
                    {item.badge}
                  </span>
                  <span className="text-sm font-semibold text-army-white uppercase tracking-wider mb-1">
                    {item.label}
                  </span>
                  <span className="text-xs text-army-muted leading-normal">
                    {item.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HistoryIntro;
