import React from 'react';
import Container from '../common/Container';

export function EraNavigation({ eras, activeEra, onSelectEra }) {
  const handleTabClick = (eraId) => {
    if (onSelectEra) {
      onSelectEra(eraId);
    }
    const targetElement = document.getElementById(eraId);
    if (targetElement) {
      const headerOffset = 130; // Offset cho Header + Era Nav sticky
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      aria-label="Điều hướng các giai đoạn lịch sử"
      className="sticky top-[56px] sm:top-[68px] z-30 bg-army-black/95 backdrop-blur-md border-y border-army-gold/30 shadow-lg py-2.5"
    >
      <Container>
        {/* Mobile: Horizontal Scroll with hidden scrollbar / Desktop: Centered */}
        <div className="flex items-center md:justify-center overflow-x-auto no-scrollbar gap-2 sm:gap-3 px-1 py-0.5">
          {eras.map((era) => {
            const isActive = activeEra === era.id;
            return (
              <button
                key={era.id}
                onClick={() => handleTabClick(era.id)}
                className={`shrink-0 px-3.5 sm:px-5 py-2 rounded-military text-xs sm:text-sm font-serif font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-army-gold text-army-maroon shadow-gold-glow border border-army-gold-light'
                    : 'bg-army-maroon/50 text-army-ivory/90 hover:text-army-gold hover:bg-army-maroon border border-army-gold/20'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-army-maroon' : 'bg-army-gold'
                  }`}
                />
                <span>{era.name}</span>
                <span className="hidden lg:inline text-[11px] opacity-80 font-sans font-normal">
                  ({era.timeframe})
                </span>
              </button>
            );
          })}
        </div>
      </Container>
    </nav>
  );
}

export default EraNavigation;
