import { useState, useEffect, useCallback } from 'react';
import milestoneService, { DEFAULT_ERAS } from '../services/milestoneService';
import eraService from '../services/eraService';
import { compareMilestonesChronological, getSavedEras } from '../constants/eraConstants';

export function useMilestones() {
  const [milestones, setMilestones] = useState([]);
  const [eras, setEras] = useState(getSavedEras());
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMilestones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [milestoneRes, galleryRes, dynamicEras] = await Promise.all([
        milestoneService.getMilestones(),
        milestoneService.getArchivalGallery(),
        eraService.getEras().catch(() => getSavedEras()),
      ]);

      // Đồng bộ các giai đoạn điều chỉnh
      const activeEras = (dynamicEras && dynamicEras.length > 0 ? dynamicEras : getSavedEras()).map((e) => ({
        ...e,
        id: e.slug || e.id || e._id,
        slug: e.slug || e.id || e._id,
      }));
      activeEras.sort((a, b) => (Number(a.order) || 1) - (Number(b.order) || 1) || (Number(a.startYear) || 0) - (Number(b.startYear) || 0));
      setEras(activeEras);

      const rawItems = Array.isArray(milestoneRes?.data) ? milestoneRes.data : [];
      const items = [...rawItems].sort((a, b) => compareMilestonesChronological(a, b, activeEras));
      setMilestones(items);

      setGallery(galleryRes || []);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu lịch sử:', err);
      setError('Không thể kết nối đến hệ thống máy chủ. Vui lòng thử lại.');
      setMilestones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMilestones();

    const handleEraUpdate = () => {
      fetchMilestones();
    };
    window.addEventListener('era-updated', handleEraUpdate);
    return () => window.removeEventListener('era-updated', handleEraUpdate);
  }, [fetchMilestones]);

  return {
    milestones,
    eras,
    gallery,
    loading,
    error,
    isMock: false,
    refetch: fetchMilestones,
  };
}

export default useMilestones;
