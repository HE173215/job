import React from 'react';
import { Star } from 'lucide-react';
import Container from '../common/Container';

export function EraBreak({ era }) {
  if (!era) return null;

  return (
    <section className="relative py-24 sm:py-32 my-16 overflow-hidden border-y border-army-gold/30 bg-army-black">
      {/* Background Image with Dark Vignette */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 md:bg-fixed"
        style={{
          backgroundColor: '#290102',
          backgroundImage: `radial-gradient(#410202 15%, #130102 85%)`,
        }}
      />

      {/* Military Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-army-black via-army-maroon/60 to-army-black pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 vignette-overlay pointer-events-none" />

      <Container className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Era Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-army-gold text-army-maroon font-serif font-extrabold text-xs sm:text-sm uppercase tracking-widest mb-4 shadow-gold-glow">
          <Star className="w-3.5 h-3.5 fill-army-maroon" />
          <span>{era.name}</span>
          <span className="opacity-75 font-sans font-normal">| {era.timeframe}</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-army-gold uppercase tracking-wider mb-6 drop-shadow-md">
          {era.title}
        </h2>

        {/* Ceremonial Quotation */}
        {era.quote && (
          <blockquote className="text-base sm:text-xl font-serif italic text-army-white max-w-2xl mx-auto mb-6 px-4 py-2 border-y border-army-gold/20">
            "{era.quote}"
          </blockquote>
        )}

        {/* Era Narrative Summary */}
        <p className="text-army-ivory/85 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          {era.description}
        </p>

        {/* Central Star Divider */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="w-12 h-px bg-army-gold/40" />
          <Star className="w-4 h-4 text-army-gold fill-army-gold" />
          <div className="w-12 h-px bg-army-gold/40" />
        </div>
      </Container>
    </section>
  );
}

export default EraBreak;
