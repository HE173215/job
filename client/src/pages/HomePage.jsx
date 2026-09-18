import React from 'react';
import HomeHero from '../components/home/HomeHero';
import QuickIntro from '../components/home/QuickIntro';
import FeaturedHistory from '../components/home/FeaturedHistory';
import FeaturedNews from '../components/home/FeaturedNews';
import HomeActivities from '../components/home/HomeActivities';
import HistoryGallery from '../components/history/HistoryGallery';
import useMilestones from '../hooks/useMilestones';
import useActivities from '../hooks/useActivities';
import useNews from '../hooks/useNews';
import { LoadingSpinner } from '../components/common/Loading';

export function HomePage() {
  const { milestones, gallery, loading: loadingMilestones } = useMilestones();
  const { activities, loading: loadingActivities } = useActivities();
  const { news, loading: loadingNews } = useNews();

  return (
    <div>
      {/* 1. Hero Section */}
      <HomeHero />

      {/* 2. Quick Introduction Pillars */}
      <QuickIntro />

      {/* 3. Featured History Timeline */}
      {loadingMilestones ? (
        <div className="py-20 bg-hero-gradient">
          <LoadingSpinner text="Đang tải các mốc son lịch sử..." />
        </div>
      ) : (
        <FeaturedHistory milestones={milestones} />
      )}

      {/* 4. Featured News Section */}
      {loadingNews ? (
        <div className="py-12 bg-army-black text-center">
          <LoadingSpinner text="Đang cập nhật tin tức..." />
        </div>
      ) : (
        <FeaturedNews news={news} />
      )}

      {/* 5. Activities Section */}
      {loadingActivities ? (
        <div className="py-16 bg-dark-section text-center">
          <LoadingSpinner text="Đang tải hoạt động..." />
        </div>
      ) : (
        <HomeActivities activities={activities} />
      )}

      {/* 6. Archival Gallery Preview */}
      <HistoryGallery items={gallery} />
    </div>
  );
}

export default HomePage;
