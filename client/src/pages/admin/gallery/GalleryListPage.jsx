import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import adminGalleryService from '../../../services/adminGalleryService';
import AdminPageHeader from '../../../components/admin/common/AdminPageHeader';
import AdminStatusBadge from '../../../components/admin/common/AdminStatusBadge';
import AdminPagination from '../../../components/admin/common/AdminPagination';
import AdminEmptyState from '../../../components/admin/common/AdminEmptyState';
import AdminLoading from '../../../components/admin/common/AdminLoading';
import AdminErrorState from '../../../components/admin/common/AdminErrorState';
import ConfirmModal from '../../../components/admin/common/ConfirmModal';

export function GalleryListPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminGalleryService.getList({
        page,
        limit: 15,
        search: searchQuery.trim() || undefined,
      });

      if (res?.data) {
        let items = res.data;
        if (searchQuery.trim()) {
          items = items.filter((alb) =>
            alb.title?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setAlbums(items);
        setTotal(res.pagination?.total || items.length);
        setTotalPages(res.pagination?.totalPages || 1);
      }
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách album ảnh.');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminGalleryService.delete(deleteTarget._id || deleteTarget.id);
      setDeleteTarget(null);
      await fetchList();
    } catch (err) {
      alert(err.message || 'Xóa album ảnh thất bại.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Quản Lý Thư Viện Ảnh (Albums)"
        subtitle="Danh sách các bộ sưu tập ảnh tư liệu, khoảnh khắc truyền thống và hoạt động toàn quân"
        breadcrumb={[{ label: 'Thư viện ảnh' }]}
        action={
          <Link
            to="/admin/gallery/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-serif font-bold bg-[#D99C2B] text-[#410202] hover:bg-[#D99C2B]/90 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm album ảnh mới</span>
          </Link>
        }
      />

      {/* Filter / Search */}
      <div className="mb-6 p-4 bg-white rounded-military border border-stone-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên album ảnh..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <AdminLoading text="Đang tải danh sách album..." />
      ) : error ? (
        <AdminErrorState message={error} onRetry={fetchList} />
      ) : albums.length === 0 ? (
        <AdminEmptyState
          title="Chưa có album ảnh"
          message="Hiện chưa có bộ sưu tập ảnh nào được tạo."
          createTo="/admin/gallery/create"
          createLabel="Thêm album đầu tiên"
        />
      ) : (
        <div className="bg-white rounded-military border border-stone-200 shadow-xs overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-serif uppercase tracking-wider text-stone-500 font-bold">
                <tr>
                  <th className="py-3 px-4 w-16">Ảnh bìa</th>
                  <th className="py-3 px-4">Tên album</th>
                  <th className="py-3 px-4 w-28 text-center">Số ảnh</th>
                  <th className="py-3 px-4 w-36">Trạng thái</th>
                  <th className="py-3 px-4 w-16 text-center">Thứ tự</th>
                  <th className="py-3 px-4 text-right w-24">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {albums.map((item) => (
                  <tr key={item._id || item.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-9 rounded overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                        {item.coverImage?.url ? (
                          <img
                            src={item.coverImage.url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                            No cover
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#241A18] max-w-md">
                      <div className="font-serif text-sm truncate">{item.title}</div>
                      {item.description && (
                        <div className="text-[11px] text-stone-500 truncate mt-0.5">{item.description}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-serif font-bold text-xs inline-flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-stone-500" />
                        <span>{Array.isArray(item.images) ? item.images.length : 0}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <AdminStatusBadge published={item.published} featured={item.featured} />
                    </td>
                    <td className="py-3 px-4 font-mono text-center font-bold text-stone-500">
                      {item.order || 0}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/gallery/${item._id || item.id}/edit`}
                          className="p-1.5 rounded hover:bg-stone-100 text-stone-600 hover:text-[#410202] transition-colors"
                          title="Sửa album"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-700 transition-colors cursor-pointer"
                          title="Xóa album"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List (< 768px) */}
          <div className="md:hidden divide-y divide-stone-100">
            {albums.map((item) => (
              <div key={item._id || item.id} className="p-4 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-10 rounded overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                    {item.coverImage?.url && (
                      <img src={item.coverImage.url} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-[#241A18] truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <ImageIcon className="w-3 h-3" />
                      <span>{item.images?.length || 0} ảnh trong album</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                  <AdminStatusBadge published={item.published} featured={item.featured} />
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/admin/gallery/${item._id || item.id}/edit`}
                      className="px-2.5 py-1 text-xs font-serif font-semibold rounded bg-stone-100 text-stone-700"
                    >
                      Sửa
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="px-2.5 py-1 text-xs font-serif font-semibold rounded bg-red-50 text-red-700"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-stone-50/50">
            <AdminPagination
              page={page}
              totalPages={totalPages}
              total={total}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Xác nhận xóa album ảnh"
        message={`Bạn có chắc muốn xóa album "${deleteTarget?.title}"?`}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default GalleryListPage;
