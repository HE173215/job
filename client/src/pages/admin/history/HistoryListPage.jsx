import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Calendar, Search, Filter } from 'lucide-react';
import adminMilestoneService from '../../../services/adminMilestoneService';
import AdminPageHeader from '../../../components/admin/common/AdminPageHeader';
import AdminStatusBadge from '../../../components/admin/common/AdminStatusBadge';
import AdminPagination from '../../../components/admin/common/AdminPagination';
import AdminEmptyState from '../../../components/admin/common/AdminEmptyState';
import AdminLoading from '../../../components/admin/common/AdminLoading';
import AdminErrorState from '../../../components/admin/common/AdminErrorState';
import ConfirmModal from '../../../components/admin/common/ConfirmModal';
import {
  OFFICIAL_ERAS,
  compareMilestonesChronological,
  normalizeEraId,
} from '../../../constants/eraConstants';
import eraService from '../../../services/eraService';

export function HistoryListPage() {
  const [erasList, setErasList] = useState(OFFICIAL_ERAS);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState('all');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminMilestoneService.getList({
        page,
        limit: 50,
        search: searchQuery.trim() || undefined,
        sort: 'year',
      });

      if (res?.data) {
        let items = Array.isArray(res.data) ? [...res.data] : [];

        // Lọc theo giai đoạn nếu chọn
        if (selectedEra !== 'all') {
          items = items.filter(
            (m) => normalizeEraId(m.era, m.year, erasList) === selectedEra || m.era === selectedEra
          );
        }

        // Tìm kiếm theo từ khóa
        if (searchQuery.trim()) {
          items = items.filter(
            (m) =>
              m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              m.year?.toString().includes(searchQuery)
          );
        }

        // Sắp xếp theo trình tự thời gian từ năm trước đến nay
        items.sort((a, b) => compareMilestonesChronological(a, b, erasList));

        setMilestones(items);
        setTotal(res.pagination?.total || items.length);
        setTotalPages(res.pagination?.totalPages || 1);
      }
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách mốc lịch sử.');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedEra, erasList]);

  useEffect(() => {
    eraService.getEras().then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        setErasList(res);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminMilestoneService.delete(deleteTarget._id || deleteTarget.id);
      setDeleteTarget(null);
      fetchList();
    } catch (err) {
      alert(err.message || 'Xóa mốc lịch sử thất bại.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Quản Lý Lịch Sử Truyền Thống"
        subtitle="Danh sách các cột mốc lịch sử, sự kiện được tự động sắp xếp theo giai đoạn và năm từ trước đến nay"
        breadcrumb={[{ label: 'Lịch sử truyền thống' }]}
        action={
          <Link
            to="/admin/history/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-serif font-bold bg-[#D99C2B] text-[#410202] hover:bg-[#D99C2B]/90 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm cột mốc mới</span>
          </Link>
        }
      />

      {/* Filter Bar */}
      <div className="mb-6 p-4 bg-white rounded-military border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo năm hoặc tiêu đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-500 shrink-0" />
          <select
            value={selectedEra}
            onChange={(e) => setSelectedEra(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs rounded border border-stone-200 bg-white focus:border-[#D99C2B] focus:outline-none"
          >
            <option value="all">Tất cả giai đoạn</option>
            {erasList.map((era) => (
              <option key={era.id || era._id || era.slug} value={era.id || era.slug}>
                {era.name} ({era.timeframe}): {era.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content State */}
      {loading ? (
        <AdminLoading text="Đang tải danh sách mốc lịch sử..." />
      ) : error ? (
        <AdminErrorState message={error} onRetry={fetchList} />
      ) : milestones.length === 0 ? (
        <AdminEmptyState
          title="Chưa có cột mốc lịch sử"
          message="Chưa có bản ghi mốc lịch sử nào phù hợp với bộ lọc hiện tại."
          createTo="/admin/history/create"
          createLabel="Thêm cột mốc mới"
        />
      ) : (
        <div className="bg-white rounded-military border border-stone-200 shadow-xs overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-serif uppercase tracking-wider text-stone-500 font-bold">
                <tr>
                  <th className="py-3 px-4 w-14 text-center">STT</th>
                  <th className="py-3 px-4 w-24">Năm</th>
                  <th className="py-3 px-4">Tiêu đề mốc lịch sử</th>
                  <th className="py-3 px-4">Giai đoạn</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {milestones.map((item, index) => (
                  <tr key={item._id || item.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-center text-stone-400 text-xs font-semibold">
                      {(page - 1) * 50 + index + 1}
                    </td>
                    <td className="py-3 px-4 font-serif font-extrabold text-[#410202]">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                        {item.year || '19XX'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#241A18] max-w-md">
                      <div className="truncate font-serif text-sm">{item.title}</div>
                      {item.summary && (
                        <div className="text-[11px] text-stone-500 truncate mt-0.5">{item.summary}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-stone-600 text-xs">
                      {(() => {
                        const targetId = normalizeEraId(item.era, item.year, erasList);
                        const matchedEra =
                          erasList.find((e) => e.slug === targetId || e.id === targetId || e._id === targetId) ||
                          OFFICIAL_ERAS.find((e) => e.id === targetId || e.slug === targetId);
                        return matchedEra
                          ? `${matchedEra.name} (${matchedEra.timeframe})`
                          : item.eraLabel || item.era || 'Giai đoạn';
                      })()}
                    </td>
                    <td className="py-3 px-4">
                      <AdminStatusBadge published={item.published} featured={item.featured} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/history/${item._id || item.id}/edit`}
                          className="p-1.5 rounded hover:bg-stone-100 text-stone-600 hover:text-[#410202] transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-700 transition-colors cursor-pointer"
                          title="Xóa cột mốc"
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
            {milestones.map((item, index) => (
              <div key={item._id || item.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-extrabold px-2.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-xs">
                    {item.year || '19XX'}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">STT #{index + 1}</span>
                </div>

                <h4 className="font-serif font-bold text-sm text-[#241A18]">{item.title}</h4>
                {item.summary && <p className="text-xs text-stone-500 line-clamp-2">{item.summary}</p>}

                <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                  <AdminStatusBadge published={item.published} featured={item.featured} />
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/admin/history/${item._id || item.id}/edit`}
                      className="px-2.5 py-1 text-xs font-serif font-semibold rounded bg-stone-100 text-stone-700 hover:text-[#410202]"
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

          {/* Pagination */}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Xác nhận xóa cột mốc lịch sử"
        message={`Bạn có chắc muốn xóa mốc "${deleteTarget?.title}"? Thao tác này sẽ xóa vĩnh viễn dữ liệu khỏi hệ thống.`}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default HistoryListPage;
