import React, { useState } from 'react';
import { ZoomIn, X, Calendar, Bookmark, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';
import EmptyState from '../common/EmptyState';

export function HistoryGallery({ items = [] }) {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Chuẩn hóa danh sách items (hỗ trợ cả album từ backend lẫn item ảnh đơn lẻ)
  const normalizedItems = (items || []).map((it, idx) => {
    const coverUrl = it.coverImage?.url || it.url || (Array.isArray(it.images) && it.images[0]?.url) || '';
    const albumImages = Array.isArray(it.images) && it.images.length > 0
      ? it.images
      : coverUrl
      ? [{ url: coverUrl, caption: it.caption || it.title }]
      : [];

    return {
      _id: it._id || it.id || idx,
      title: it.title || it.caption || 'Tư liệu lịch sử',
      description: it.description || it.caption || '',
      coverUrl,
      images: albumImages,
      source: it.source || 'Lưu trữ Nhà trường',
      year: it.year || '',
    };
  }).filter((it) => it.coverUrl);

  const handleOpenAlbum = (album) => {
    setSelectedAlbum(album);
    setActiveImageIndex(0);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (!selectedAlbum?.images?.length) return;
    setActiveImageIndex((prev) => (prev + 1) % selectedAlbum.images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (!selectedAlbum?.images?.length) return;
    setActiveImageIndex((prev) => (prev - 1 + selectedAlbum.images.length) % selectedAlbum.images.length);
  };

  return (
    <section id="history-gallery" className="py-20 bg-army-black border-t border-army-gold/20">
      <Container>
        <SectionTitle
          badge="LƯU TRỮ QUÂN ĐỘI"
          title="TƯ LIỆU QUA CÁC THỜI KỲ"
          subtitle="Những khoảnh khắc ghi dấu bước chân kiên cường, ý chí sắt đá và trang sử vẻ vang của Nhà trường."
        />

        {normalizedItems.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={ImageIcon}
              message="Kho tư liệu hình ảnh đang được cập nhật."
              description="Hệ thống lưu trữ đang đồng bộ các tư liệu truyền thống và hiện vật lịch sử của Nhà trường."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {normalizedItems.map((item) => (
              <div
                key={item._id}
                onClick={() => handleOpenAlbum(item)}
                className="group relative overflow-hidden rounded-military bg-army-maroon/60 border border-army-gold/30 hover:border-army-gold transition-all duration-300 shadow-card-dark cursor-pointer flex flex-col"
              >
                {/* Image Frame */}
                <div className="relative aspect-[16/10] overflow-hidden bg-army-black">
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Dark Gold Hover Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-army-black via-army-black/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Year / Image Count Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-army-gold text-army-maroon font-serif font-extrabold text-xs shadow-sm flex items-center gap-1">
                    {item.year ? (
                      item.year
                    ) : item.images.length > 1 ? (
                      <>
                        <ImageIcon className="w-3 h-3" />
                        <span>{item.images.length} ảnh</span>
                      </>
                    ) : (
                      'Tư liệu'
                    )}
                  </div>

                  {/* Zoom Icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-army-black/70 border border-army-gold/50 flex items-center justify-center text-army-gold opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>

                {/* Caption Content */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h4 className="font-serif font-bold text-army-gold text-sm sm:text-base leading-snug mb-1.5 group-hover:text-army-gold-light transition-colors">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-army-ivory/80 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-army-gold/15 flex items-center justify-between text-[11px] text-army-muted">
                    <span className="flex items-center gap-1">
                      <Bookmark className="w-3 h-3 text-army-gold/60" />
                      {item.source}
                    </span>
                    <span className="text-army-gold hover:underline">Phóng to xem ảnh →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>

      {/* Lightbox Modal */}
      {selectedAlbum && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedAlbum(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-army-black border border-army-gold p-4 sm:p-6 rounded-military shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedAlbum(null)}
              className="absolute top-3 right-3 text-army-gold hover:text-white p-2 rounded-full bg-army-black/80 border border-army-gold/40 z-20"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Display */}
            <div className="relative aspect-[16/10] bg-black/80 rounded overflow-hidden mb-4 border border-army-gold/30 flex items-center justify-center">
              {selectedAlbum.images?.[activeImageIndex]?.url ? (
                <img
                  src={selectedAlbum.images[activeImageIndex].url}
                  alt={selectedAlbum.images[activeImageIndex]?.caption || selectedAlbum.title}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <img
                  src={selectedAlbum.coverUrl}
                  alt={selectedAlbum.title}
                  className="max-h-full max-w-full object-contain"
                />
              )}

              {/* Navigation Arrows if multi-images */}
              {selectedAlbum.images?.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-army-black/70 border border-army-gold/40 text-army-gold hover:text-white hover:bg-army-maroon transition-colors"
                    aria-label="Ảnh trước"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-army-black/70 border border-army-gold/40 text-army-gold hover:text-white hover:bg-army-maroon transition-colors"
                    aria-label="Ảnh tiếp"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-army-gold/20 pt-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-army-gold">
                  {selectedAlbum.title}
                </h3>
                {selectedAlbum.description && (
                  <p className="text-xs text-army-ivory/80 mt-1 max-w-2xl">
                    {selectedAlbum.description}
                  </p>
                )}
                {selectedAlbum.images?.[activeImageIndex]?.caption && (
                  <p className="text-xs text-army-gold/90 mt-0.5 italic">
                    {selectedAlbum.images[activeImageIndex].caption}
                  </p>
                )}
              </div>

              {selectedAlbum.images?.length > 1 && (
                <div className="text-xs text-army-gold font-serif px-2.5 py-1 rounded bg-army-maroon/80 border border-army-gold/30">
                  {activeImageIndex + 1} / {selectedAlbum.images.length}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default HistoryGallery;
