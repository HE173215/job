import { useState, useEffect, useCallback } from 'react';
import newsService from '../services/newsService';

export function useNews(params = {}) {
  const [news, setNews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await newsService.getNews(params);
      setNews(res.data || []);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Lỗi khi tải tin tức:', err);
      setError(err.message || 'Không thể kết nối đến máy chủ.');
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    news,
    pagination,
    loading,
    error,
    refetch: fetchNews,
  };
}

export default useNews;
