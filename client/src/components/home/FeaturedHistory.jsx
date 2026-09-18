import React from 'react';
import { ArrowRight, Calendar, Bookmark, Star } from 'lucide-react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';

export function FeaturedHistory({ milestones = [] }) {
  // Ưu tiên các mốc được đánh dấu featured, nếu không lấy 4 mốc đầu
  const featured = milestones.filter((m) => m.featured);
  const featuredItems = (featured.length > 0 ? featured : milestones).slice(0, 4);

  return (
    <section className="py-20 bg-hero-gradient relative border-b border-army-gold/20 overflow-hidden">
      {/* Radial overlay */}
      <div className="absolute inset-0 bg-hero-radial pointer-events-none" />

      <Container className="relative z-10">
        <SectionTitle
          badge="DẤU ẤN THỜI GIAN"
          title="CÁC MỐC SON TIÊU BIỂU"
          subtitle="Điểm lại những dấu mốc lịch sử quan trọng đánh dấu sự trưởng thành và phát triển của Trường Sĩ quan Chính trị."
        />

        {featuredItems.length === 0 ? (
          <div className="py-8">
            <EmptyState
              message="Chưa có mốc son lịch sử nào được hiển thị."
              description="Các mốc lịch sử tiêu biểu đang được cập nhật từ hồ sơ truyền thống của Nhà trường."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredItems.map((item, idx) => (
              <div
                key={item._id || idx}
                className="group relative p-5 rounded-military bg-army-maroon/80 border border-army-gold/30 hover:border-army-gold transition-all duration-300 shadow-card-dark flex flex-col justify-between"
              >
                <div>
                  {/* Year Badge & Number */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-sm bg-army-gold text-army-maroon font-serif font-extrabold text-xs tracking-wider shadow-sm">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.year || 'Mốc son'}
                    </span>
                    <span className="text-xs font-serif text-army-gold/70 font-bold">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Archival Thumbnail */}
                  {item.coverImage?.url && (
                    <div className="relative mb-3.5 overflow-hidden rounded border border-army-gold/20 aspect-[16/10]">
                      <img
                        src={item.coverImage.url}
                        alt={item.coverImage.alt || item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-army-black/70 via-transparent to-transparent" />
                    </div>
                  )}

                  {/* Title */}
                  <h4 className="font-serif font-bold text-army-gold text-base leading-snug mb-2 group-hover:text-army-gold-light transition-colors line-clamp-2">
                    {item.title}
                  </h4>

                  {/* Summary */}
                  {item.summary && (
                    <p className="text-xs text-army-ivory/80 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  )}
                </div>

                {/* Bottom metadata */}
                <div className="mt-4 pt-3 border-t border-army-gold/15 flex items-center justify-between text-[11px] text-army-muted">
                  <span>{item.era ? `Thời kỳ: ${item.era}` : 'Lịch sử truyền thống'}</span>
                  <Star className="w-3 h-3 text-army-gold/50" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Central CTA to History Page */}
        <div className="text-center pt-4">
          <Button
            to="/history"
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
          >
            Khám phá toàn bộ hành trình lịch sử
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default FeaturedHistory;
