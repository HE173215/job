import React from 'react';

export function SectionTitle({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
}) {
  const alignClasses = {
    center: 'text-center items-center',
    left: 'text-left items-start',
    right: 'text-right items-end',
  };

  return (
    <div className={`flex flex-col ${alignClasses[align]} mb-12 sm:mb-16 ${className}`}>
      {/* Badge / Chuyên mục */}
      {badge && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-army-maroon/80 border border-army-gold/30 text-army-gold text-xs uppercase tracking-widest font-semibold mb-3">
          <span className="inline-block w-1.5 h-1.5 bg-army-gold rotate-45" />
          {badge}
          <span className="inline-block w-1.5 h-1.5 bg-army-gold rotate-45" />
        </div>
      )}

      {/* Tiêu đề chính vàng kim */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-extrabold text-army-gold uppercase tracking-wider leading-tight drop-shadow-[0_2px_10px_rgba(217,156,43,0.25)]">
        {title}
      </h2>

      {/* Vạch trang trí quân đội */}
      <div className="flex items-center gap-3 my-4">
        <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-r from-transparent via-army-gold to-army-gold" />
        <div className="w-2.5 h-2.5 text-army-gold flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-army-gold">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-l from-transparent via-army-gold to-army-gold" />
      </div>

      {/* Mô tả phụ trắng ngà */}
      {subtitle && (
        <p className="max-w-2xl text-army-ivory/80 text-sm sm:text-base font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;
