import React, { useState } from 'react';
import HistoryHero from '../components/history/HistoryHero';
import HistoryIntro from '../components/history/HistoryIntro';
import EraNavigation from '../components/history/EraNavigation';
import Timeline from '../components/history/Timeline';
import HistoryGallery from '../components/history/HistoryGallery';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import { TimelineSkeleton } from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import useMilestones from '../hooks/useMilestones';
import { Shield, BookOpen, Star } from 'lucide-react';

export function HistoryPage() {
  const { milestones, eras, gallery, loading, error, refetch } = useMilestones();
  const [activeEra, setActiveEra] = useState('giai-doan-1');

  return (
    <div className="bg-army-black text-army-white min-h-screen">
      {/* 1. History Hero (100vh, Ceremonial) */}
      <HistoryHero />

      {/* 2. History Intro & Architectural Overview */}
      <HistoryIntro />


      {/* 3. Loading, Error, or Main Timeline */}
      {loading ? (
        <div className="py-20 bg-dark-section">
          <div className="text-center mb-8">
            <h3 className="font-serif text-army-gold text-lg font-bold uppercase tracking-wider">
              Đang đồng bộ dòng thời gian lịch sử...
            </h3>
            <p className="text-xs text-army-muted mt-1">
              Khởi tạo không gian tái hiện các thời kỳ vẻ vang
            </p>
          </div>
          <TimelineSkeleton />
        </div>
      ) : error ? (
        <div className="py-20 bg-dark-section">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      ) : milestones.length === 0 ? (
        <div className="py-20 bg-dark-section">
          <EmptyState message="Thông tin lịch sử đang được cập nhật." />
        </div>
      ) : (
        <>
          {/* 4. Sticky Era Navigation Bar */}
          <EraNavigation
            eras={eras}
            activeEra={activeEra}
            onSelectEra={(eraId) => setActiveEra(eraId)}
          />

          {/* 5. Interactive Vertical Timeline */}
          <section className="relative bg-dark-section py-10 overflow-hidden">
            <Timeline
              milestones={milestones}
              eras={eras}
              onEraVisible={(eraId) => setActiveEra(eraId)}
            />
          </section>
        </>
      )}

      {/* 6. Archival Historical Gallery */}
      <HistoryGallery items={gallery} />

      {/* 7. Bottom Ceremonial CTA */}
      <section className="py-20 bg-hero-gradient border-t border-army-gold/30 relative text-center">
        <Container className="max-w-3xl">
          <div className="w-12 h-12 rounded-full bg-army-black border border-army-gold mx-auto flex items-center justify-center text-army-gold mb-4 shadow-gold-glow">
            <Star className="w-6 h-6 fill-army-gold" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-army-gold uppercase tracking-wider mb-4">
            TIẾP NỐI TRUYỀN THỐNG – VỮNG BƯỚC TƯƠNG LAI
          </h2>
          <p className="text-army-ivory/85 text-sm sm:text-base mb-8 leading-relaxed">
            Mỗi cán bộ, giảng viên, học viên, nhân viên, chiến sĩ hôm nay nguyện đem hết tâm sức, trí tuệ, tiếp tục viết tiếp những trang sử vàng chói lọi của Trường Sĩ quan Chính trị anh hùng.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button to="/" variant="secondary" size="md">
              Về trang chủ
            </Button>
            <Button to="/gallery" variant="primary" size="md">
              Xem toàn bộ tư liệu
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default HistoryPage;
