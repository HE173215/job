import React, { useRef, useState, useEffect } from 'react';
import TimelineItem from './TimelineItem';
import EraBreak from './EraBreak';
import EmptyState from '../common/EmptyState';

export function Timeline({ milestones = [], eras = [], onEraVisible }) {
  const timelineRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeMilestoneId, setActiveMilestoneId] = useState(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (timelineRef.current) {
            const rect = timelineRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Tính toán tiến trình cuộn qua vùng timeline
            const totalHeight = rect.height;
            const scrolled = windowHeight * 0.5 - rect.top;
            const progress = Math.min(Math.max(scrolled / totalHeight, 0), 1);
            setScrollProgress(progress);

            // Kiểm tra mốc son nào đang ở gần giữa màn hình
            const items = timelineRef.current.querySelectorAll('[data-milestone-id]');
            let currentActiveId = null;
            let currentActiveEra = null;

            items.forEach((item) => {
              const itemRect = item.getBoundingClientRect();
              if (itemRect.top <= windowHeight * 0.6 && itemRect.bottom >= windowHeight * 0.2) {
                currentActiveId = item.getAttribute('data-milestone-id');
                currentActiveEra = item.getAttribute('data-era-id');
              }
            });

            if (currentActiveId) {
              setActiveMilestoneId(currentActiveId);
            }
            if (currentActiveEra && onEraVisible) {
              onEraVisible(currentActiveEra);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [onEraVisible]);

  if (!milestones || milestones.length === 0) {
    return (
      <div className="py-12">
        <EmptyState message="Thông tin lịch sử đang được cập nhật." />
      </div>
    );
  }

  // Nhóm milestones theo era
  const assignedGroups = eras
    .map((era) => ({
      era,
      items: milestones.filter((m) => m.era === era.id || m.era === era.name),
    }))
    .filter((g) => g.items.length > 0);

  // Mốc son chưa thuộc nhóm era nào cụ thể
  const unassignedItems = milestones.filter(
    (m) => !eras.some((e) => e.id === m.era || e.name === m.era)
  );

  const groupedMilestones = [...assignedGroups];
  if (unassignedItems.length > 0) {
    groupedMilestones.push({
      era: {
        id: 'tong-hop',
        name: 'Mốc son truyền thống',
        title: 'Lịch sử phát triển Nhà trường',
        timeframe: 'Tổng hợp',
      },
      items: unassignedItems,
    });
  }

  let globalItemIndex = 0;

  return (
    <div ref={timelineRef} className="relative py-12 max-w-6xl mx-auto px-4 sm:px-6">
      {/* 
        Timeline Vertical Track & Progress Line
        Desktop: center (left-1/2)
        Mobile: left-aligned (left-6)
      */}
      {/* Background Track Line */}
      <div className="absolute left-6 md:left-1/2 top-10 bottom-10 w-0.5 bg-army-gold/20 -translate-x-1/2 pointer-events-none" />

      {/* Dynamic Scroll Progress Line */}
      <div
        className="absolute left-6 md:left-1/2 top-10 w-0.5 bg-gradient-to-b from-army-gold via-army-gold-light to-army-gold -translate-x-1/2 shadow-timeline-glow transition-all duration-75 pointer-events-none"
        style={{
          height: `${scrollProgress * 100}%`,
          maxHeight: 'calc(100% - 80px)',
        }}
      />

      {/* Render eras and milestones */}
      {groupedMilestones.map(({ era, items }, eraIdx) => (
        <div key={era.id} id={era.id} className="relative mb-16 scroll-mt-36">
          {/* Historical Era Break Between Eras */}
          {eraIdx > 0 && <EraBreak era={era} />}

          {/* Era Header Anchor Banner */}
          <div className="text-center my-10 relative z-20">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-army-black border border-army-gold/50 text-army-gold shadow-gold-glow">
              <span className="w-2 h-2 rounded-full bg-army-gold animate-ping" />
              <span className="font-serif font-bold text-sm sm:text-base uppercase tracking-wider">
                {era.name}{era.title ? `: ${era.title}` : ''}
              </span>
              {era.timeframe && (
                <span className="text-xs text-army-gold-light font-sans opacity-80">
                  ({era.timeframe})
                </span>
              )}
            </div>
          </div>

          {/* Milestones inside this era */}
          <div className="relative">
            {items.map((milestone) => {
              const isLeft = globalItemIndex % 2 === 0;
              const isActive = activeMilestoneId === milestone._id;
              globalItemIndex += 1;

              return (
                <div
                  key={milestone._id || globalItemIndex}
                  data-milestone-id={milestone._id}
                  data-era-id={era.id}
                  className="w-full"
                >
                  <TimelineItem
                    milestone={milestone}
                    index={globalItemIndex}
                    isLeft={isLeft}
                    isActive={isActive}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Timeline;
