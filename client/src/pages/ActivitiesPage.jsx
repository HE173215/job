import React, { useState } from 'react';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { LoadingSpinner } from '../components/common/Loading';
import useActivities from '../hooks/useActivities';
import { Calendar, MapPin, Shield, Clock, X, ChevronRight } from 'lucide-react';

export function ActivitiesPage() {
  const { activities, loading, error, refetch } = useActivities();
  const [selectedActivity, setSelectedActivity] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  const highlightActivity = activities.find((a) => a.featured) || activities[0];
  const listActivities = highlightActivity
    ? activities.filter((a) => a._id !== highlightActivity._id)
    : activities;

  return (
    <div className="min-h-screen bg-army-black py-16">
      <Container>
        <SectionTitle
          badge="CÔNG TÁC & PHONG TRÀO"
          title="HOẠT ĐỘNG NHÀ TRƯỜNG"
          subtitle="Toàn cảnh các hoạt động đào tạo, phong trào thi đua, diễn tập thực địa và công tác dân vận của Trường Sĩ quan Chính trị."
        />

        {loading ? (
          <div className="py-20 text-center">
            <LoadingSpinner text="Đang tải dữ liệu hoạt động..." />
          </div>
        ) : error ? (
          <div className="py-16">
            <ErrorState message={error} onRetry={refetch} />
          </div>
        ) : activities.length === 0 ? (
          <div className="py-16">
            <EmptyState
              message="Chưa có hoạt động nào được đăng tải."
              description="Các hoạt động giáo dục đào tạo, phong trào thi đua và huấn luyện sẽ được cập nhật khi có thông tin chính thức."
            />
          </div>
        ) : (
          <>
            {/* Highlight Activity */}
            {highlightActivity && (
              <div className="mb-12 p-6 sm:p-8 rounded-military bg-gradient-to-r from-army-maroon via-army-red-dark to-army-maroon border-2 border-army-gold/60 shadow-gold-glow relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-army-black/60 border border-army-gold/40 text-army-gold text-xs font-serif uppercase tracking-widest font-bold mb-3">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Hoạt động tiêu biểu</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-army-gold mb-3 leading-snug">
                      {highlightActivity.title}
                    </h2>

                    {highlightActivity.excerpt && (
                      <p className="text-sm sm:text-base text-army-ivory/90 leading-relaxed mb-6">
                        {highlightActivity.excerpt}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-army-gold/80 mb-6">
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

                    <button
                      onClick={() => setSelectedActivity(highlightActivity)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-military bg-army-gold text-army-maroon font-serif font-bold text-xs uppercase tracking-wider hover:bg-army-gold-light transition-colors shadow-sm"
                    >
                      <span>Xem nội dung chi tiết</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {highlightActivity.coverImage?.url && (
                    <div className="lg:col-span-5">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-military border border-army-gold/40 shadow-card-dark">
                        <img
                          src={highlightActivity.coverImage.url}
                          alt={highlightActivity.coverImage.alt || highlightActivity.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* List of remaining activities */}
            {listActivities.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listActivities.map((act) => (
                  <div
                    key={act._id || act.slug}
                    className="p-6 rounded-military bg-army-maroon/60 border border-army-gold/25 hover:border-army-gold transition-all duration-300 shadow-card-dark flex flex-col justify-between group"
                  >
                    <div>
                      {act.coverImage?.url && (
                        <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded border border-army-gold/20">
                          <img
                            src={act.coverImage.url}
                            alt={act.coverImage.alt || act.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-3 text-xs">
                        {act.location && (
                          <span className="px-2 py-0.5 rounded bg-army-gold/15 text-army-gold font-semibold uppercase tracking-wider text-[11px] border border-army-gold/30 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {act.location}
                          </span>
                        )}
                        {act.startDate && (
                          <span className="text-army-muted flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-army-gold/60" />
                            {formatDate(act.startDate)}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif font-bold text-army-gold text-lg mb-2.5 group-hover:text-army-gold-light transition-colors leading-snug">
                        {act.title}
                      </h3>

                      {act.excerpt && (
                        <p className="text-xs sm:text-sm text-army-ivory/80 leading-relaxed line-clamp-3">
                          {act.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-army-gold/15 flex items-center justify-between text-xs text-army-gold">
                      <button
                        onClick={() => setSelectedActivity(act)}
                        className="font-serif uppercase tracking-wider text-[11px] hover:underline flex items-center gap-1"
                      >
                        Chi tiết hoạt động
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

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedActivity(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-army-dark border border-army-gold p-6 sm:p-8 rounded-military shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute top-4 right-4 text-army-muted hover:text-army-gold p-1"
              aria-label="Đóng"
            >
              <X className="w-6 h-6" />
            </button>

            {selectedActivity.coverImage?.url && (
              <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded border border-army-gold/30">
                <img
                  src={selectedActivity.coverImage.url}
                  alt={selectedActivity.coverImage.alt || selectedActivity.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-army-gold mb-3">
              {selectedActivity.startDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selectedActivity.startDate)}
                  {selectedActivity.endDate ? ` - ${formatDate(selectedActivity.endDate)}` : ''}
                </span>
              )}
              {selectedActivity.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {selectedActivity.location}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-army-gold mb-4 leading-snug">
              {selectedActivity.title}
            </h2>

            {selectedActivity.content ? (
              <div className="text-army-ivory/90 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                {selectedActivity.content}
              </div>
            ) : selectedActivity.excerpt ? (
              <p className="text-army-ivory/90 text-sm sm:text-base leading-relaxed">
                {selectedActivity.excerpt}
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

export default ActivitiesPage;
