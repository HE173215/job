import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Search,
  Calendar,
  Quote,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown,
} from 'lucide-react';
import eraService from '../../../services/eraService';
import EraFormModal from './EraFormModal';

export function EraListPage() {
  const [eras, setEras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEra, setEditingEra] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const loadEras = async () => {
    setLoading(true);
    try {
      const data = await eraService.getEras();
      setEras(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách giai đoạn:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEras();

    const handleUpdate = () => {
      loadEras();
    };
    window.addEventListener('era-updated', handleUpdate);
    return () => window.removeEventListener('era-updated', handleUpdate);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenCreate = () => {
    setEditingEra(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (era) => {
    setEditingEra(era);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (editingEra) {
        const targetId = editingEra._id || editingEra.id || editingEra.slug;
        await eraService.updateEra(targetId, formData);
        showToast('Đã cập nhật giai đoạn lịch sử thành công!');
      } else {
        await eraService.createEra(formData);
        showToast('Đã thêm giai đoạn lịch sử mới thành công!');
      }
      await loadEras();
    } catch (err) {
      showToast(err.message || 'Lưu giai đoạn thất bại!', 'error');
    }
  };

  const handleDelete = async (era) => {
    try {
      const targetId = era._id || era.id || era.slug;
      await eraService.deleteEra(targetId);
      setDeleteConfirmId(null);
      showToast(`Đã xóa "${era.name}" khỏi hệ thống!`);
      await loadEras();
    } catch (err) {
      showToast(err.message || 'Xóa giai đoạn thất bại!', 'error');
    }
  };

  const filteredEras = eras.filter((e) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      e.name?.toLowerCase().includes(q) ||
      e.title?.toLowerCase().includes(q) ||
      e.timeframe?.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-army-gold text-army-maroon px-4 py-3 rounded-lg shadow-xl font-serif font-bold text-sm flex items-center gap-2 border border-army-maroon animate-bounce">
          <CheckCircle className="w-5 h-5 text-army-maroon" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-[#410202] text-army-ivory p-6 rounded-lg border border-army-gold/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-army-black/50 border border-army-gold/30 text-army-gold text-xs font-serif font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Quy Chuẩn Biên Niên Sử</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-army-gold uppercase tracking-wider">
            Quản Lý Các Giai Đoạn Lịch Sử
          </h1>
          <p className="text-xs sm:text-sm text-army-ivory/80 mt-1 max-w-2xl">
            Chuẩn hóa hệ thống các thời kỳ lịch sử của Trường Sĩ quan Chính trị từ năm 1951 đến nay. Các giai đoạn được tự động sắp xếp theo trình tự năm từ trước đến nay.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded bg-army-gold hover:bg-army-gold-light text-army-maroon font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-gold-glow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm giai đoạn</span>
          </button>
        </div>
      </div>

      {/* Filter and Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-lg border border-army-gold/20 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm giai đoạn, năm, tiêu đề..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold transition-colors"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-army-maroon" />
            Tổng số: <strong className="text-army-maroon">{eras.length} giai đoạn</strong>
          </span>
          <span className="flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-army-gold" />
            Sắp xếp: <strong>Từ năm trước đến nay</strong>
          </span>
        </div>
      </div>

      {/* Eras List */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 font-serif">
          Đang tải dữ liệu giai đoạn lịch sử...
        </div>
      ) : filteredEras.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-dashed border-gray-300 text-gray-500">
          Không tìm thấy giai đoạn nào phù hợp với từ khóa tìm kiếm.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEras.map((era, index) => (
            <div
              key={era.id || era._id || era.slug || index}
              className="bg-white rounded-lg border border-army-gold/30 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5">
                {/* Header of Card */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-army-maroon text-army-gold font-serif font-bold text-xs flex items-center justify-center border border-army-gold/50 shadow-xs shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-serif font-extrabold text-army-maroon text-base tracking-wide">
                        {era.name}
                      </h3>
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-army-gold/15 text-army-gold-dark border border-army-gold/30">
                        {era.timeframe}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(era)}
                      className="p-1.5 text-gray-600 hover:text-army-maroon hover:bg-army-gold/10 rounded transition-colors"
                      title="Chỉnh sửa giai đoạn"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(era.id || era._id || era.slug)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Xóa giai đoạn"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <h4 className="font-serif font-bold text-gray-900 text-sm mb-2 leading-snug">
                  {era.title}
                </h4>

                {era.quote && (
                  <div className="my-2 p-2.5 bg-army-ivory/60 border-l-2 border-army-gold rounded-r text-xs italic text-gray-700 flex items-start gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-army-gold shrink-0 mt-0.5" />
                    <span>&ldquo;{era.quote}&rdquo;</span>
                  </div>
                )}

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {era.description || 'Chưa có mô tả chi tiết cho giai đoạn này.'}
                </p>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>
                  Khoảng năm: <strong>{era.startYear}</strong> &rarr;{' '}
                  <strong>{era.endYear === 9999 ? 'Hiện nay' : era.endYear}</strong>
                </span>
                <span className="font-mono text-[10px] text-gray-400">
                  Slug: {era.slug || era.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl border border-red-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif font-bold text-base">Xác nhận xóa giai đoạn lịch sử</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa giai đoạn này không? Các mốc sự kiện thuộc giai đoạn này vẫn sẽ được giữ lại nhưng sẽ được tự động quy về giai đoạn gần nhất.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  const target = eras.find(
                    (e) => (e.id || e._id || e.slug) === deleteConfirmId
                  );
                  if (target) handleDelete(target);
                }}
                className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-serif font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <EraFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingEra}
        defaultOrder={eras.length > 0 ? Math.max(...eras.map((e) => Number(e.order) || 0), 0) + 1 : 1}
      />
    </div>
  );
}

export default EraListPage;
