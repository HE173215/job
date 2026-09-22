import React, { useState, useEffect } from 'react';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';
import LoadingSpinner from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import battalionService from '../services/battalionService';
import {
  Shield,
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  ExternalLink,
  Users,
  Image as ImageIcon,
  CheckCircle,
  X,
} from 'lucide-react';

export function BattalionsPage() {
  const [battalions, setBattalions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchBattalions = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await battalionService.getAll();
        if (mounted) {
          setBattalions(data);
          setSelectedId(data[0]?._id || data[0]?.code || null);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Không thể tải danh sách tiểu đoàn.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchBattalions();

    return () => {
      mounted = false;
    };
  }, [reloadKey]);

  const currentBattalion =
    battalions.find(
      (b) =>
        b.id === selectedId ||
        b._id === selectedId ||
        (b.code && b.code.toLowerCase() === String(selectedId).toLowerCase())
    ) ||
    battalions[0] ||
    null;

  if (loading) {
    return (
      <div className="bg-army-black min-h-screen pt-20">
        <LoadingSpinner text="Đang tải danh sách tiểu đoàn..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-army-black min-h-screen pt-20">
        <ErrorState message={error} onRetry={() => setReloadKey((value) => value + 1)} />
      </div>
    );
  }

  if (!currentBattalion) {
    return (
      <div className="bg-army-black text-army-white min-h-screen py-20">
        <Container>
          <SectionTitle
            badge="CƠ CẤU ĐƠN VỊ"
            title="CÁC ĐƠN VỊ TIỂU ĐOÀN"
            subtitle="Danh sách đơn vị tiểu đoàn hiện đang trống."
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-army-black text-army-white min-h-screen pb-20">
      {/* 1. Hero Header Banner */}
      <section className="relative py-16 sm:py-24 bg-hero-gradient border-b border-army-gold/30 text-center overflow-hidden">
        <div className="absolute inset-0 bg-hero-radial pointer-events-none" />
        <Container className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-army-maroon/80 border border-army-gold/40 text-army-gold text-xs uppercase tracking-widest font-semibold mb-4 shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            <span>Cơ Cấu Đơn Vị Quản Lý Học Viên</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-extrabold text-army-gold uppercase tracking-wider mb-4 drop-shadow-[0_2px_12px_rgba(217,156,43,0.3)]">
            CÁC ĐƠN VỊ TIỂU ĐOÀN
          </h1>

          <p className="text-army-ivory/85 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Hệ thống các đơn vị quản lý học viên – Cái nôi tôi luyện bản lĩnh chính trị, phương pháp tác phong chỉ huy và đạo đức người cán bộ quân đội mẫu mực.
          </p>
        </Container>
      </section>

      {/* 2. Battalion Selector Bar */}
      <div className="sticky top-[64px] z-30 bg-army-dark/95 backdrop-blur-md border-b border-army-gold/30 py-3 shadow-lg">
        <Container>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-army-gold/40">
            {battalions.map((b) => {
              const bKey = b.id || b.code || b._id;
              const isActive = b.id === selectedId || b.code === selectedId || b._id === selectedId;
              return (
                <button
                  key={bKey}
                  onClick={() => setSelectedId(bKey)}
                  className={`px-3.5 py-1.5 rounded text-xs font-serif font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-army-gold text-army-maroon shadow-gold-glow font-extrabold scale-105'
                      : 'bg-army-maroon/50 text-army-ivory/90 hover:text-army-gold hover:bg-army-maroon border border-army-gold/20'
                  }`}
                >
                  {b.name}
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      <Container className="pt-10">
        {/* 3. Battalion Header & Tradition Section */}
        <div className="mb-12 p-6 sm:p-8 rounded-military bg-gradient-to-br from-army-maroon/80 via-army-dark to-army-black border border-army-gold/40 shadow-card-dark relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-army-red/10 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Top Bar: Title & Emblems */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-army-gold/20">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-army-black border border-army-gold flex items-center justify-center text-army-gold shadow-gold-glow shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-army-gold font-serif uppercase tracking-widest font-semibold block">
                    {currentBattalion?.emblemTitle}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-army-white tracking-wide">
                    {currentBattalion?.fullName}
                  </h2>
                </div>
              </div>

              {/* Slogan Badge */}
              {currentBattalion?.slogan && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-army-black/60 border border-army-gold/30 text-army-gold-light text-xs font-serif italic">
                  <Award className="w-4 h-4 text-army-gold shrink-0" />
                  <span>"{currentBattalion.slogan}"</span>
                </div>
              )}
            </div>

            {/* Grid: Tradition & Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              {/* Box 1: Truyền thống */}
              <div className="p-4 sm:p-5 rounded bg-army-black/40 border border-army-gold/20">
                <h3 className="font-serif font-bold text-sm text-army-gold uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-army-gold" />
                  Truyền thống vẻ vang
                </h3>
                <p className="text-xs sm:text-sm text-army-ivory/85 leading-relaxed">
                  {currentBattalion?.tradition || 'Đang cập nhật truyền thống vẻ vang của đơn vị.'}
                </p>
              </div>

              {/* Box 2: Nhiệm vụ chính trị */}
              <div className="p-4 sm:p-5 rounded bg-army-black/40 border border-army-gold/20">
                <h3 className="font-serif font-bold text-sm text-army-gold uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <Users className="w-4 h-4 text-army-gold" />
                  Chức năng nhiệm vụ
                </h3>
                <p className="text-xs sm:text-sm text-army-ivory/85 leading-relaxed">
                  {currentBattalion?.mission || 'Đang cập nhật chức năng nhiệm vụ chính trị.'}
                </p>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-6 pt-4 border-t border-army-gold/15 flex flex-wrap items-center justify-between gap-4 text-xs text-army-muted">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-army-gold" />
                <span>{currentBattalion?.stats?.established || 'Đơn vị quản lý học viên nòng cốt'}</span>
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-army-gold">
                <Award className="w-3.5 h-3.5 text-army-gold" />
                <span>{currentBattalion?.stats?.highlight || 'Đơn vị Quyết thắng'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 4. Posts and Activities of this Battalion */}
        <div className="space-y-6">
          <SectionTitle
            badge="TƯ LIỆU HOẠT ĐỘNG"
            title={`HÌNH ẢNH & BÀI ĐĂNG • ${(currentBattalion?.name || 'TIỂU ĐOÀN').toUpperCase()}`}
            subtitle="Các hoạt động học tập, rèn luyện trên thao trường và sinh hoạt tư tưởng tiêu biểu"
          />

          {currentBattalion?.posts && currentBattalion.posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentBattalion.posts.map((post, idx) => (
                <div
                  key={post.id || post._id || idx}
                  className="rounded-military bg-army-dark/70 border border-army-gold/25 overflow-hidden shadow-card-dark flex flex-col hover:border-army-gold transition-all duration-300 group"
                >
                  {/* Image with zoom on click */}
                  <div
                    onClick={() => setSelectedImage(post.imageUrl)}
                    className="relative aspect-[16/10] overflow-hidden bg-army-black cursor-pointer"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-army-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-army-maroon/90 border border-army-gold/30 text-[10px] text-army-gold font-serif font-bold uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="absolute bottom-2 right-2 p-1 rounded bg-black/60 text-white/80 group-hover:text-army-gold transition-colors">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-army-muted mb-1.5">
                        <Calendar className="w-3.5 h-3.5 text-army-gold/80" />
                        <span>{post.date}</span>
                        <span className="text-army-gold/40">•</span>
                        <span>{post.author}</span>
                      </div>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-army-white group-hover:text-army-gold transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-xs text-army-ivory/75 mt-2 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-army-gold/15 flex items-center justify-between text-xs text-army-gold">
                      <span className="font-serif font-semibold text-[11px]">
                        {currentBattalion.name}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] hover:underline cursor-pointer">
                        <span>Chi tiết</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded bg-army-dark/50 border border-army-gold/20 text-center text-xs text-army-muted">
              Đang tiếp tục cập nhật các bài viết và hình ảnh tư liệu của {currentBattalion.name}.
            </div>
          )}
        </div>
      </Container>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/10 text-white hover:text-army-gold transition-colors"
              aria-label="Đóng xem ảnh"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Tư liệu ảnh phóng to"
              className="max-h-[80vh] w-auto rounded border border-army-gold/50 shadow-2xl object-contain"
            />
            <p className="text-xs text-army-muted mt-2">Nhấp bất kỳ đâu để đóng</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BattalionsPage;
