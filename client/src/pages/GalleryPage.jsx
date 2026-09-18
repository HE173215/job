import React from 'react';
import HistoryGallery from '../components/history/HistoryGallery';
import useGallery from '../hooks/useGallery';
import { LoadingSpinner } from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';

export function GalleryPage() {
  const { albums, loading, error, refetch } = useGallery();

  return (
    <div className="min-h-screen bg-army-black py-10">
      {loading ? (
        <div className="py-20 text-center">
          <LoadingSpinner text="Đang mở kho lưu trữ tư liệu ảnh..." />
        </div>
      ) : error ? (
        <div className="py-16">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      ) : (
        <HistoryGallery items={albums} />
      )}
    </div>
  );
}

export default GalleryPage;
