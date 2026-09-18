import { useState, useEffect, useCallback } from 'react';
import galleryService from '../services/galleryService';

export function useGallery(params = {}) {
  const [albums, setAlbums] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await galleryService.getGallery(params);
      setAlbums(res.data || []);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Lỗi khi tải thư viện ảnh:', err);
      setError(err.message || 'Không thể kết nối đến máy chủ.');
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  return {
    albums,
    pagination,
    loading,
    error,
    refetch: fetchGallery,
  };
}

export default useGallery;
