import React from 'react';
import { Star, ChevronDown } from 'lucide-react';
import Container from '../common/Container';

export function HistoryHero({ onScrollDown }) {
  const handleScrollClick = () => {
    if (onScrollDown) {
      onScrollDown();
    } else {
      const eraSection = document.getElementById('history-intro');
      if (eraSection) {
        eraSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center bg-hero-gradient text-center overflow-hidden">
      {/* Radial overlay glow */}
      <div className="absolute inset-0 bg-hero-radial pointer-events-none" />

      {/* Decorative Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D99C2B 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Subtle vignette */}
      <div className="absolute inset-0 vignette-overlay pointer-events-none" />

      <Container className="relative z-10 py-20 flex flex-col items-center">
        {/* Emblem Top Badge */}
        <div className="mb-6 flex items-center justify-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-b from-army-maroon to-army-black border-2 border-army-gold flex items-center justify-center shadow-gold-glow-lg overflow-hidden">
            <img
              src="/logo.png"
              alt="Logo Trường Sĩ quan Chính trị"
              className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(217,156,43,0.5)]"
            />
            <div className="absolute -inset-1 rounded-full border border-army-gold/30 animate-pulse pointer-events-none" />
          </div>
        </div>

        {/* Subtitle */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-army-maroon/80 border border-army-gold/40 text-army-gold text-xs sm:text-sm uppercase tracking-widest font-semibold mb-5 shadow-sm">
          <span>Hành Trình Lịch Sử & Truyền Thống Vẻ Vang</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-extrabold text-army-gold uppercase tracking-wider leading-[1.2] sm:leading-[1.18] md:leading-[1.15] max-w-5xl drop-shadow-[0_4px_16px_rgba(217,156,43,0.35)]">
          TRƯỜNG SĨ QUAN CHÍNH TRỊ
        </h1>

        {/* Divider with Center Star */}
        <div className="flex items-center gap-4 my-6 sm:my-8">
          <div className="w-16 sm:w-28 h-[1.5px] bg-gradient-to-r from-transparent via-army-gold to-army-gold" />
          <div className="w-3 h-3 text-army-gold flex items-center justify-center rotate-45 bg-army-gold" />
          <div className="w-16 sm:w-28 h-[1.5px] bg-gradient-to-l from-transparent via-army-gold to-army-gold" />
        </div>

        {/* Narrative Description */}
        <p className="max-w-3xl text-army-ivory text-base sm:text-lg md:text-xl font-normal leading-relaxed opacity-90 px-4">
          Hành trình vẻ vang qua các thời kỳ xây dựng, chiến đấu và trưởng thành.
          Nơi tôi luyện bản lĩnh, bồi đắp phẩm chất và tôi rèn tri thức của những người cán bộ chính trị ưu tú trong Quân đội nhân dân Việt Nam.
        </p>

        {/* Scroll down prompt */}
        <button
          onClick={handleScrollClick}
          className="mt-12 sm:mt-16 group flex flex-col items-center gap-2 text-army-gold/80 hover:text-army-gold transition-all duration-300 focus:outline-none"
          aria-label="Cuộn xuống để khám phá các mốc lịch sử"
        >
          <span className="text-xs uppercase tracking-widest font-serif font-semibold">
            Bắt đầu hành trình khám phá
          </span>
          <div className="w-9 h-9 rounded-full border border-army-gold/40 flex items-center justify-center group-hover:border-army-gold group-hover:bg-army-gold/10 transition-colors shadow-sm animate-bounce">
            <ChevronDown className="w-5 h-5 text-army-gold" />
          </div>
        </button>
      </Container>
    </section>
  );
}

export default HistoryHero;
