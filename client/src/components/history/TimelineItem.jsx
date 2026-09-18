import React, { useState } from 'react';
import { Calendar, ZoomIn, Eye, Bookmark, X } from 'lucide-react';

export function TimelineItem({
  milestone,
  index,
  isLeft = false,
  isActive = false,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className={`relative flex flex-col md:flex-row items-start md:items-center w-full my-6 sm:my-8 group ${
          isLeft ? 'md:flex-row-reverse' : ''
        }`}
      >
        {/* Timeline Dot (Desktop: Center / Mobile: Left-aligned at 24px) */}
        <div
          className={`absolute left-6 md:left-1/2 -translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 z-20 flex items-center justify-center transition-all duration-500 ${
            isActive ? 'scale-125' : 'scale-100 group-hover:scale-110'
          }`}
        >
          {/* Milestone Dot */}
          <div
            className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
              isActive
                ? 'bg-army-gold border-army-white shadow-[0_0_12px_rgba(217,156,43,0.9)]'
                : 'bg-army-maroon border-army-gold shadow-gold-glow group-hover:border-army-gold-light'
            }`}
          >
            {/* Center core */}
            <div
              className={`w-1.5 h-1.5 rounded-full m-auto mt-1 transition-colors ${
                isActive ? 'bg-army-maroon' : 'bg-army-gold'
              }`}
            />
          </div>
        </div>

        {/* Milestone Card */}
        {/* Mobile: padding-left to leave space for left timeline */}
        <div
          className={`w-full md:w-[45%] pl-16 md:pl-0 ${
            isLeft ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'
          }`}
        >
          <div
            className={`relative p-5 sm:p-6 rounded-military bg-army-maroon/85 border transition-all duration-300 backdrop-blur-md shadow-card-dark ${
              isActive
                ? 'border-army-gold shadow-gold-glow bg-army-maroon/95'
                : 'border-army-gold/30 hover:border-army-gold/60 hover:bg-army-maroon/90'
            }`}
          >
            {/* Top Row: Year Badge & Category */}
            <div
              className={`flex items-center gap-3 mb-3.5 ${
                isLeft ? 'md:justify-end' : 'justify-start'
              }`}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-army-gold text-army-maroon font-serif font-extrabold text-xs sm:text-sm tracking-wider shadow-sm">
                <Calendar className="w-3.5 h-3.5" />
                {milestone.year || '19XX'}
              </span>
              <span className="text-[11px] text-army-gold-light/80 uppercase tracking-widest font-serif font-semibold">
                {milestone.eraLabel || 'Mốc son lịch sử'}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold text-army-gold leading-snug mb-3 drop-shadow-sm group-hover:text-army-gold-light transition-colors">
              {milestone.title}
            </h3>

            {/* Archival Image */}
            {milestone.coverImage?.url && (
              <div className="relative mb-4 overflow-hidden rounded border border-army-gold/30 group/img">
                <img
                  src={milestone.coverImage.url}
                  alt={milestone.coverImage.alt || milestone.title}
                  className="w-full h-44 sm:h-52 object-cover transition-transform duration-500 group-hover/img:scale-105"
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div
                  onClick={() => setIsModalOpen(true)}
                  className="absolute inset-0 bg-army-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer gap-2 text-army-gold font-serif text-xs uppercase tracking-wider"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span>Xem tư liệu lớn</span>
                </div>

                {/* Caption bar */}
                {milestone.coverImage.caption && (
                  <div className="p-2 bg-army-black/90 text-[11px] text-army-ivory/80 italic border-t border-army-gold/20 text-left">
                    {milestone.coverImage.caption}
                  </div>
                )}
              </div>
            )}

            {/* Summary Text */}
            <p className="text-army-ivory/90 text-xs sm:text-sm leading-relaxed mb-3">
              {milestone.summary}
            </p>

            {/* Source / Metadata */}
            <div
              className={`flex items-center gap-2 pt-2.5 border-t border-army-gold/15 text-[11px] text-army-muted ${
                isLeft ? 'md:justify-end' : 'justify-start'
              }`}
            >
              <Bookmark className="w-3 h-3 text-army-gold/60" />
              <span>Nguồn: {milestone.source || '[Tư liệu lưu trữ mẫu]'}</span>
            </div>
          </div>
        </div>

        {/* Blank space on desktop to maintain symmetry */}
        <div className="hidden md:block md:w-[45%]" />
      </div>

      {/* Lightbox Modal for Archival Image */}
      {isModalOpen && milestone.coverImage?.url && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-army-black border border-army-gold p-4 sm:p-6 rounded-military shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-army-gold/20">
              <span className="font-serif font-bold text-army-gold text-sm sm:text-base">
                {milestone.title} ({milestone.year})
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-army-ivory hover:text-army-gold transition-colors"
                aria-label="Đóng ảnh phóng to"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <img
              src={milestone.coverImage.url}
              alt={milestone.coverImage.alt || milestone.title}
              className="w-full max-h-[70vh] object-contain rounded border border-army-gold/20"
            />
            <p className="mt-3 text-xs sm:text-sm text-army-ivory/90 text-center italic">
              {milestone.coverImage.caption || milestone.summary}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default TimelineItem;
