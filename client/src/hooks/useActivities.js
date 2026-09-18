import { useState, useEffect, useCallback } from 'react';
import activityService from '../services/activityService';

export function useActivities(params = {}) {
  const [activities, setActivities] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await activityService.getActivities(params);
      setActivities(res.data || []);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Lỗi khi tải hoạt động:', err);
      setError(err.message || 'Không thể kết nối đến máy chủ.');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    pagination,
    loading,
    error,
    refetch: fetchActivities,
  };
}

export default useActivities;
