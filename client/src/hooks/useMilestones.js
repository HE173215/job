import { useState, useEffect, useCallback } from 'react';
import milestoneService, { DEFAULT_ERAS } from '../services/milestoneService';

export function useMilestones() {
  const [milestones, setMilestones] = useState([]);
  const [eras, setEras] = useState(DEFAULT_ERAS || []);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMilestones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [milestoneRes, galleryRes] = await Promise.all([
        milestoneService.getMilestones(),
        milestoneService.getArchivalGallery(),
      ]);

      const items = milestoneRes.data || [];
      setMilestones(items);

      // Đồng bộ các giai đoạn: Giữ các giai đoạn chuẩn và bổ sung nếu có giai đoạn mới từ dữ liệu
      let allEras = [...(milestoneRes.eras || DEFAULT_ERAS || [])];
      const usedEraIds = new Set(items.map((m) => m.era).filter(Boolean));
      usedEraIds.forEach((eraId) => {
        if (!allEras.some((e) => e.id === eraId)) {
          allEras.push({
            id: eraId,
            name: `Giai đoạn: ${eraId}`,
            years: '',
            description: '',
          });
        }
      });
      setEras(allEras);

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
