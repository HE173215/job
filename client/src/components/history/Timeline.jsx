import React, { useRef, useState, useEffect } from 'react';
import TimelineItem from './TimelineItem';
import EraBreak from './EraBreak';
import EmptyState from '../common/EmptyState';
import {
  normalizeEraId,
  compareMilestonesChronological,
  getSavedEras,
} from '../../constants/eraConstants';

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

  // Chuẩn hóa danh sách các giai đoạn điều chỉnh
  const rawEras = eras && eras.length > 0 ? eras : getSavedEras();
  const normalizedEras = rawEras.map((e) => ({
    ...e,
    id: e.slug || e.id || e._id,
    slug: e.slug || e.id || e._id,
  }));

  // Nhóm milestones theo từng giai đoạn điều chỉnh
  const assignedGroups = normalizedEras.map((era) => {
    const eraKey = String(era.slug || era.id || era._id || '').toLowerCase();
    const eraDbId = String(era._id || '').toLowerCase();

    const eraItems = milestones.filter((m) => {
      const assignedEraId = String(normalizeEraId(m.era, m.year, normalizedEras) || '').toLowerCase();
      return (
        assignedEraId === eraKey ||
        (eraDbId && assignedEraId === eraDbId) ||
        (era.id && assignedEraId === String(era.id).toLowerCase())
      );
    });

    // Sắp xếp các mốc son trong cùng giai đoạn theo năm từ trước đến nay
    eraItems.sort((a, b) => compareMilestonesChronological(a, b, normalizedEras));

    return {
      era,
      items: eraItems,
    };
  });

  // Thu thập các mốc son chưa thuộc nhóm era nào (nếu có mốc ngoài phạm vi)
  const assignedMilestoneIds = new Set(
    assignedGroups.flatMap((g) =>
      g.items.map((item) => String(item._id || item.id || item.slug))
    )
  );
  const unassignedItems = milestones
    .filter((m) => !assignedMilestoneIds.has(String(m._id || m.id || m.slug)))
    .sort((a, b) => compareMilestonesChronological(a, b, normalizedEras));

  // Tự động phân bổ các mốc chưa gán vào giai đoạn gần nhất theo năm
  if (unassignedItems.length > 0) {
    unassignedItems.forEach((m) => {
      const bestEra = getEraByYear(m.year, normalizedEras);
      const targetGroup = assignedGroups.find(
        (g) =>
          String(g.era.slug || g.era.id || g.era._id).toLowerCase() ===
          String(bestEra?.slug || bestEra?.id || bestEra?._id).toLowerCase()
      );
      if (targetGroup) {
        targetGroup.items.push(m);
        targetGroup.items.sort((a, b) => compareMilestonesChronological(a, b, normalizedEras));
      }
    });
  }

  const groupedMilestones = [...assignedGroups];

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
            {items.length === 0 ? (
              <div className="text-center py-6 px-4 bg-army-black/40 border border-army-gold/20 rounded-military max-w-md mx-auto text-xs text-army-muted my-4">
                Các mốc sự kiện tiêu biểu thuộc {era.name} đang tiếp tục được bổ sung và cập nhật.
              </div>
            ) : (
              items.map((milestone) => {
                const isLeft = globalItemIndex % 2 === 0;
                const mKey = milestone._id || milestone.id || milestone.slug || String(globalItemIndex);
                const isActive = activeMilestoneId === mKey;
                globalItemIndex += 1;

                return (
                  <div
                    key={mKey}
                    data-milestone-id={mKey}
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
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Timeline;
