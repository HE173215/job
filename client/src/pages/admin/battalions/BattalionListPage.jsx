import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react';
import battalionService from '../../../services/battalionService';

export function BattalionListPage() {
  const [battalions, setBattalions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const loadBattalions = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await battalionService.getAll();
      setBattalions(data);
    } catch (err) {
      setErrorMessage(err.message || 'Không thể tải danh sách tiểu đoàn từ máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBattalions();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleDelete = async (b) => {
    const targetId = b.id || b._id || b.code;
    try {
      await battalionService.delete(targetId);
      setDeleteConfirmId(null);
      showToast(`Đã xóa đơn vị "${b.name}" thành công!`);
      await loadBattalions();
    } catch (err) {
      setDeleteConfirmId(null);
      setErrorMessage(err.message || 'Không thể xóa đơn vị tiểu đoàn.');
    }
  };

  const filtered = battalions.filter((b) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      b.name?.toLowerCase().includes(q) ||
      b.fullName?.toLowerCase().includes(q) ||
      b.code?.toLowerCase().includes(q) ||
      b.emblemTitle?.toLowerCase().includes(q) ||
      b.slogan?.toLowerCase().includes(q)
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

      {errorMessage && (
        <div role="alert" className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#410202] text-army-ivory p-6 rounded-lg border border-army-gold/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-army-black/50 border border-army-gold/30 text-army-gold text-xs font-serif font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Cơ Cấu Tổ Chức Quân Sự</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-army-gold uppercase tracking-wider">
            Quản Lý Các Đơn Vị Tiểu Đoàn
          </h1>
          <p className="text-xs sm:text-sm text-army-ivory/80 mt-1 max-w-2xl">
            Quản trị danh mục các tiểu đoàn quản lý học viên, thông tin truyền thống, chức năng nhiệm vụ và hệ thống bài đăng/hình ảnh hoạt động thực tế.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/battalions/create"
            className="px-4 py-2 rounded bg-army-gold hover:bg-army-gold-light text-army-maroon font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-gold-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm tiểu đoàn mới</span>
          </Link>
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
            placeholder="Tìm theo tên, mã, khẩu hiệu..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold transition-colors"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-army-maroon" />
            Tổng số: <strong className="text-army-maroon">{battalions.length} đơn vị</strong>
          </span>
          <Link
            to="/battalions"
            target="_blank"
            className="flex items-center gap-1 text-army-maroon hover:text-army-gold font-bold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Xem trang công khai</span>
          </Link>
        </div>
      </div>

      {/* Battalions Table */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 font-serif">
          Đang tải dữ liệu đơn vị tiểu đoàn...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-dashed border-gray-300 text-gray-500">
          Không tìm thấy đơn vị tiểu đoàn nào phù hợp.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-army-gold/20 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-army-dark/95 text-army-gold uppercase font-serif tracking-wider border-b border-army-gold/30">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">STT</th>
                  <th className="py-3.5 px-4">Tên đơn vị</th>
                  <th className="py-3.5 px-4">Danh hiệu & Khẩu hiệu</th>
                  <th className="py-3.5 px-4 text-center">Bài đăng / Ảnh</th>
                  <th className="py-3.5 px-4 text-center">Mã đơn vị</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((b, idx) => {
                  const targetId = b.id || b._id || b.code;
                  const postsCount = Array.isArray(b.posts) ? b.posts.length : 0;

                  return (
                    <tr key={targetId} className="hover:bg-amber-50/50 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-gray-500">
                        {b.order || idx + 1}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-serif font-bold text-army-maroon text-sm">
                          {b.name}
                        </div>
                        <div className="text-[11px] text-gray-500 line-clamp-1">
                          {b.fullName}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        {b.emblemTitle && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-army-gold/15 text-army-gold-dark border border-army-gold/30 mb-1">
                            {b.emblemTitle}
                          </span>
                        )}
                        {b.slogan && (
                          <div className="text-[11px] text-gray-600 italic line-clamp-1">
                            &ldquo;{b.slogan}&rdquo;
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 font-bold text-gray-700 text-xs">
                          <ImageIcon className="w-3 h-3 text-army-maroon" />
                          <span>{postsCount} bài viết</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono text-[11px] text-gray-500 uppercase font-semibold">
                        {b.code || b.id}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/admin/battalions/${targetId}/edit`)}
                            className="p-1.5 text-gray-600 hover:text-army-maroon hover:bg-army-gold/10 rounded transition-colors cursor-pointer"
                            title="Chỉnh sửa tiểu đoàn"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(targetId)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Xóa tiểu đoàn"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl border border-red-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif font-bold text-base">Xác nhận xóa đơn vị tiểu đoàn</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa đơn vị này không? Toàn bộ truyền thống và bài đăng hoạt động gắn kèm sẽ bị xóa.
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
                  const target = battalions.find(
                    (b) => (b.id || b._id || b.code) === deleteConfirmId
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
    </div>
  );
}

export default BattalionListPage;
