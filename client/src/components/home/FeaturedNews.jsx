import React from 'react';
import { Calendar, ChevronRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';
import EmptyState from '../common/EmptyState';

export function FeaturedNews({ news = [] }) {
  const displayNews = news.slice(0, 3);

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
    <section className="py-20 bg-army-black border-b border-army-gold/20">
      <Container>
        <SectionTitle
          badge="BẢN TIN NỘI BỘ"
          title="TIN TỨC & SỰ KIỆN NỔI BẬT"
          subtitle="Điểm tin hoạt động giáo dục, thi đua và công tác đảng, công tác chính trị tiêu biểu."
        />

        {displayNews.length === 0 ? (
          <div className="py-8">
            <EmptyState
              icon={Newspaper}
              message="Chưa có tin tức nào được đăng tải."
              description="Các tin tức và sự kiện mới nhất sẽ sớm được cập nhật tại đây."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {displayNews.map((item) => (
              <div
                key={item._id || item.slug}
                className="p-5 rounded-military bg-army-maroon/50 border border-army-gold/25 hover:border-army-gold transition-all duration-300 shadow-card-dark flex flex-col justify-between group"
              >
                <div>
                  {item.thumbnail?.url && (
                    <div className="relative mb-3.5 aspect-[16/10] overflow-hidden rounded border border-army-gold/20">
                      <img
                        src={item.thumbnail.url}
                        alt={item.thumbnail.alt || item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2 text-xs">
                    {item.category && (
                      <span className="px-2 py-0.5 rounded bg-army-gold/15 text-army-gold font-semibold uppercase tracking-wider text-[10px] border border-army-gold/30">
                        {item.category}
                      </span>
                    )}
                    {(item.publishedAt || item.createdAt) && (
                      <span className="text-army-muted text-[11px] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-army-gold/60" />
                        {formatDate(item.publishedAt || item.createdAt)}
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif font-bold text-army-gold text-base leading-snug mb-2 group-hover:text-army-gold-light transition-colors line-clamp-2">
                    {item.title}
                  </h4>

                  {item.excerpt && (
                    <p className="text-xs text-army-ivory/80 leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-army-gold/15 flex items-center justify-between text-xs text-army-gold">
                  <Link
                    to="/news"
                    className="font-serif uppercase tracking-wider text-[11px] hover:underline flex items-center gap-1"
                  >
                    Xem chi tiết
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

export default FeaturedNews;
