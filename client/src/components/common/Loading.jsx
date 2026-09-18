import React from 'react';

export function LoadingSpinner({ text = 'Đang tải dữ liệu...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative w-14 h-14">
        {/* Outer Ring */}
        <div className="w-14 h-14 rounded-full border-2 border-army-gold/20 border-t-army-gold animate-spin" />
        {/* Center Star */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-army-gold rotate-45 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-army-gold text-sm tracking-widest uppercase font-serif">
        {text}
      </p>
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="py-12 max-w-5xl mx-auto px-4">
      <div className="relative">
        {/* Central dummy line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-army-gold/15 -translate-x-1/2" />
        <div className="md:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-army-gold/15" />

        <div className="space-y-12">
          {[1, 2, 3].map((i) => {
            const isLeft = i % 2 === 1;
            return (
              <div
                key={i}
                className={`relative flex flex-col md:flex-row items-center ${
                  isLeft ? 'md:flex-row-reverse' : ''
                } pl-10 md:pl-0`}
              >
                {/* Dummy Card */}
                <div className="w-full md:w-[46%] p-6 rounded-military bg-army-maroon/40 border border-army-gold/15 animate-pulse">
                  <div className="w-20 h-6 bg-army-gold/20 rounded mb-4" />
                  <div className="w-3/4 h-6 bg-army-ivory/20 rounded mb-3" />
                  <div className="w-full h-40 bg-army-black/50 rounded mb-4 border border-army-gold/10" />
                  <div className="w-full h-4 bg-army-ivory/10 rounded mb-2" />
                  <div className="w-4/5 h-4 bg-army-ivory/10 rounded" />
                </div>

                {/* Dummy Dot */}
                <div className="absolute md:left-1/2 left-4 -translate-x-1/2 w-4 h-4 rounded-full bg-army-maroon border-2 border-army-gold/40" />

                {/* Blank side on desktop */}
                <div className="hidden md:block md:w-[46%]" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
