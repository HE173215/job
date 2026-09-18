import React from 'react';
import { Calendar, Tag, ArrowRight, Shield, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';
import EmptyState from '../common/EmptyState';

export function HomeActivities({ activities = [] }) {
  // Nếu chưa có hoạt động nào
  if (!activities || activities.length === 0) {
    return (
      <section className="py-20 bg-dark-section border-b border-army-gold/20">
        <Container>
          <SectionTitle
            badge="ĐỜI SỐNG & HOẠT ĐỘNG"
            title="HOẠT ĐỘNG NỔI BẬT NHÀ TRƯỜNG"
            subtitle="Ghi nhận những chuyển động sôi nổi trong công tác giảng dạy, học tập, rèn luyện và công tác dân vận."
          />
          <EmptyState
            message="Hiện chưa có hoạt động nào được đăng tải."
            description="Các hoạt động giảng dạy, huấn luyện và phong trào thi đua sẽ sớm được cập nhật tại đây."
          />
        </Container>
      </section>
    );
  }

  // Chọn hoạt động nổi bật (featured hoặc mục đầu tiên)
  const highlightActivity = activities.find((a) => a.featured) || activities[0];
  const gridActivities = activities.filter((a) => a._id !== highlightActivity?._id).slice(0, 3);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="py-20 bg-dark-section border-b border-army-gold/20">
      <Container>
        <SectionTitle
          badge="ĐỜI SỐNG & HOẠT ĐỘNG"
          title="HOẠT ĐỘNG NỔI BẬT NHÀ TRƯỜNG"
          subtitle="Ghi nhận những chuyển động sôi nổi trong công tác giảng dạy, học tập, rèn luyện và công tác dân vận."
        />

        {/* Featured Campaign Highlight Panel (Red dark panel, gold border) */}
        {highlightActivity && (
          <div className="mb-10 p-6 sm:p-8 rounded-military bg-gradient-to-r from-army-maroon via-army-red-dark to-army-maroon border-2 border-army-gold/60 shadow-gold-glow relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-army-gold/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-army-black/60 border border-army-gold/40 text-army-gold text-xs font-serif uppercase tracking-widest font-bold mb-3">
                <Shield className="w-3.5 h-3.5" />
                <span>Hoạt động tiêu biểu</span>
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-army-gold mb-3 leading-snug">
                {highlightActivity.title}
              </h3>

              {highlightActivity.excerpt && (
                <p className="text-sm sm:text-base text-army-ivory/90 leading-relaxed mb-5">
                  {highlightActivity.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-army-gold/80">
                {highlightActivity.startDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-army-gold" />
                    Thời gian: {formatDate(highlightActivity.startDate)}
                    {highlightActivity.endDate ? ` - ${formatDate(highlightActivity.endDate)}` : ''}
                  </span>
                )}
                {highlightActivity.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-army-gold" />
                      Địa điểm: {highlightActivity.location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3 Columns Activities Grid */}
        {gridActivities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridActivities.map((item) => (
              <div
                key={item._id || item.slug}
                className="p-6 rounded-military bg-army-maroon/50 border border-army-gold/25 hover:border-army-gold transition-all duration-300 shadow-card-dark flex flex-col justify-between group"
              >
                <div>
                  {item.coverImage?.url && (
                    <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded border border-army-gold/20">
                      <img
                        src={item.coverImage.url}
                        alt={item.coverImage.alt || item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3 text-xs">
                    {item.location && (
                      <span className="px-2 py-0.5 rounded bg-army-gold/15 text-army-gold font-semibold uppercase tracking-wider text-[11px] border border-army-gold/30 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </span>
                    )}
                    {item.startDate && (
                      <span className="text-army-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-army-gold/60" />
                        {formatDate(item.startDate)}
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif font-bold text-army-gold text-base leading-snug mb-2.5 group-hover:text-army-gold-light transition-colors">
                    {item.title}
                  </h4>

                  {item.excerpt && (
                    <p className="text-xs sm:text-sm text-army-ivory/80 leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-army-gold/15 flex items-center justify-between text-xs text-army-gold">
                  <Link
                    to="/activities"
                    className="font-serif uppercase tracking-wider text-[11px] hover:underline flex items-center gap-1"
                  >
                    Xem chi tiết
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

export default HomeActivities;
