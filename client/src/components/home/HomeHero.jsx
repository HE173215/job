import React from 'react';
import { Star, ChevronRight, Shield, ArrowDown } from 'lucide-react';
import Container from '../common/Container';
import Button from '../common/Button';

export function HomeHero() {
  const handleScrollDown = () => {
    const nextSection = document.getElementById('home-intro');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center bg-hero-gradient text-center overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-hero-radial pointer-events-none" />

      {/* Decorative Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D99C2B 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 vignette-overlay pointer-events-none" />

      <Container className="relative z-10 py-20 flex flex-col items-center">
        {/* Emblem Top Circle */}
        <div className="mb-6 flex items-center justify-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-army-maroon via-army-red to-army-black border-2 border-army-gold flex items-center justify-center shadow-gold-glow-lg">
            <Star className="w-10 h-10 sm:w-12 sm:h-12 text-army-gold fill-army-gold" />
            <div className="absolute -inset-1.5 rounded-full border border-army-gold/30 animate-pulse pointer-events-none" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-army-maroon/80 border border-army-gold/40 text-army-gold text-xs sm:text-sm uppercase tracking-widest font-semibold mb-4 shadow-sm">
          <Shield className="w-3.5 h-3.5" />
          <span>Bộ Quốc Phòng • Quân Đội Nhân Dân Việt Nam</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-extrabold text-army-gold uppercase tracking-wider leading-[1.2] sm:leading-[1.18] md:leading-[1.15] max-w-5xl drop-shadow-[0_4px_16px_rgba(217,156,43,0.35)]">
          TRƯỜNG SĨ QUAN CHÍNH TRỊ
        </h1>

        {/* Traditional Divider */}
        <div className="flex items-center gap-4 my-6 sm:my-8">
          <div className="w-16 sm:w-24 h-[1.5px] bg-gradient-to-r from-transparent via-army-gold to-army-gold" />
          <div className="w-3 h-3 text-army-gold flex items-center justify-center rotate-45 bg-army-gold" />
          <div className="w-16 sm:w-24 h-[1.5px] bg-gradient-to-l from-transparent via-army-gold to-army-gold" />
        </div>

        {/* Ceremonial Subheading */}
        <p className="max-w-3xl text-army-ivory text-base sm:text-lg md:text-xl font-normal leading-relaxed opacity-90 px-4 mb-8 sm:mb-10">
          Trung tâm đào tạo sĩ quan chính trị cấp phân đội, bồi dưỡng cán bộ chính trị và nghiên cứu khoa học xã hội nhân văn quân sự hàng đầu của Quân đội.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center">
          <Button
            to="/history"
            variant="primary"
            size="lg"
            icon={ChevronRight}
            iconPosition="right"
            className="w-full sm:w-auto"
          >
            Khám phá hành trình lịch sử
          </Button>

          <Button
            to="/news"
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            Tin tức & Hoạt động
          </Button>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={handleScrollDown}
          className="mt-14 group flex flex-col items-center gap-2 text-army-gold/80 hover:text-army-gold transition-colors focus:outline-none"
          aria-label="Cuộn xuống để xem thêm"
        >
          <span className="text-[11px] uppercase tracking-widest font-serif font-semibold">
            Cuộn xuống
          </span>
          <div className="w-8 h-8 rounded-full border border-army-gold/30 flex items-center justify-center group-hover:border-army-gold group-hover:bg-army-gold/10 transition-colors animate-bounce">
            <ArrowDown className="w-4 h-4 text-army-gold" />
          </div>
        </button>
      </Container>
    </section>
  );
}

export default HomeHero;
