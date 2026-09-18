import React, { useState } from 'react';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { LoadingSpinner } from '../components/common/Loading';
import useNews from '../hooks/useNews';
import { Calendar, Tag, ChevronRight, X, Newspaper } from 'lucide-react';

export function NewsPage() {
  const { news, loading, error, refetch } = useNews();
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  // Trích xuất danh sách chuyên mục có thực từ các bài viết
  const categories = ['all', ...Array.from(new Set(news.map((n) => n.category).filter(Boolean)))];

  const filteredNews =
    selectedCategory === 'all'
      ? news
      : news.filter((n) => n.category === selectedCategory);

  return (
    <div className="py-16 bg-dark-section min-h-screen">
      <Container>
        <SectionTitle
          badge="BẢN TIN & SỰ KIỆN"
          title="TIN TỨC & SỰ KIỆN NHÀ TRƯỜNG"
          subtitle="Cập nhật kịp thời những hoạt động giáo dục đào tạo, phong trào thi đua và các sự kiện chính trị trọng điểm."
        />

        {loading ? (
          <div className="py-20 text-center">
            <LoadingSpinner text="Đang tải danh sách tin tức..." />
          </div>
        ) : error ? (
          <div className="py-16">
            <ErrorState message={error} onRetry={refetch} />
          </div>
        ) : news.length === 0 ? (
          <div className="py-16">
            <EmptyState
              icon={Newspaper}
              message="Chưa có bài viết tin tức nào được đăng tải."
              description="Các tin tức sự kiện mới nhất sẽ được ban biên tập đăng tải trong thời gian tới."
            />
          </div>
        ) : (
          <>
            {/* Category Filter Tabs */}
            {categories.length > 2 && (
              <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-military text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
                      selectedCategory === cat
                        ? 'bg-army-gold text-army-maroon shadow-gold-glow font-bold'
                        : 'bg-army-maroon/50 text-army-ivory/80 hover:text-army-gold hover:bg-army-maroon border border-army-gold/20'
                    }`}
                  >
                    {cat === 'all' ? 'Tất cả tin tức' : cat}
                  </button>
                ))}
              </div>
            )}

            {filteredNews.length === 0 ? (
              <div className="py-12">
                <EmptyState message="Không có tin tức nào thuộc chuyên mục này." />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {filteredNews.map((item) => (
                  <div
                    key={item._id || item.slug}
                    className="p-6 rounded-military bg-army-maroon/60 border border-army-gold/25 hover:border-army-gold transition-all duration-300 shadow-card-dark flex flex-col justify-between group"
                  >
                    <div>
                      {item.thumbnail?.url && (
                        <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded border border-army-gold/20">
                          <img
                            src={item.thumbnail.url}
                            alt={item.thumbnail.alt || item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-3 text-xs">
                        {item.category && (
                          <span className="px-2.5 py-0.5 rounded bg-army-gold/15 text-army-gold font-semibold uppercase tracking-wider text-[11px] border border-army-gold/30">
                            {item.category}
                          </span>
                        )}
                        {(item.publishedAt || item.createdAt) && (
                          <span className="text-army-muted flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-army-gold/60" />
                            {formatDate(item.publishedAt || item.createdAt)}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif font-bold text-army-gold text-lg mb-3 group-hover:text-army-gold-light transition-colors leading-snug">
                        {item.title}
                      </h3>

                      {item.excerpt && (
                        <p className="text-xs sm:text-sm text-army-ivory/80 leading-relaxed line-clamp-3">
                          {item.excerpt}
                        </p>
                      )}

                      {Array.isArray(item.tags) && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {item.tags.map((t, tidx) => (
                            <span
                              key={tidx}
                              className="text-[10px] text-army-gold/70 bg-army-black/40 px-2 py-0.5 rounded border border-army-gold/15"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-army-gold/15 flex items-center justify-between text-xs text-army-gold">
                      <button
                        onClick={() => setSelectedNews(item)}
                        className="font-serif uppercase tracking-wider text-[11px] hover:underline flex items-center gap-1"
                      >
                        Đọc toàn bộ bài viết
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Container>

      {/* News Detail Modal */}
      {selectedNews && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedNews(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-army-dark border border-army-gold p-6 sm:p-8 rounded-military shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 text-army-muted hover:text-army-gold p-1"
              aria-label="Đóng"
            >
              <X className="w-6 h-6" />
            </button>

            {selectedNews.thumbnail?.url && (
              <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded border border-army-gold/30">
                <img
                  src={selectedNews.thumbnail.url}
                  alt={selectedNews.thumbnail.alt || selectedNews.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-army-gold mb-3">
              {selectedNews.category && (
                <span className="px-2.5 py-0.5 rounded bg-army-gold text-army-maroon font-bold uppercase tracking-wider text-[11px]">
                  {selectedNews.category}
                </span>
              )}
              {(selectedNews.publishedAt || selectedNews.createdAt) && (
                <span className="flex items-center gap-1.5 text-army-muted">
                  <Calendar className="w-3.5 h-3.5 text-army-gold" />
                  {formatDate(selectedNews.publishedAt || selectedNews.createdAt)}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-army-gold mb-4 leading-snug">
              {selectedNews.title}
            </h2>

            {selectedNews.content ? (
              <div className="text-army-ivory/90 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                {selectedNews.content}
              </div>
            ) : selectedNews.excerpt ? (
              <p className="text-army-ivory/90 text-sm sm:text-base leading-relaxed">
                {selectedNews.excerpt}
              </p>
            ) : (
              <p className="text-army-muted text-sm italic">Nội dung chi tiết đang được cập nhật.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsPage;
