import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminMilestoneService from '../../../services/adminMilestoneService';
import ImageUploader from '../../../components/admin/media/ImageUploader';
import MultiImageUploader from '../../../components/admin/media/MultiImageUploader';
import AdminPageHeader from '../../../components/admin/common/AdminPageHeader';
import AdminLoading from '../../../components/admin/common/AdminLoading';
import { slugify } from '../../../utils/slug';
import { Save, Eye, Loader2, AlertCircle } from 'lucide-react';

export function HistoryFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    year: '',
    date: '',
    title: '',
    slug: '',
    era: 'giai-doan-1',
    summary: '',
    content: '',
    coverImage: null,
    gallery: [],
    source: '',
    order: 0,
    featured: false,
    published: true,
  });

  useEffect(() => {
    if (!isEdit) return;

    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const data = await adminMilestoneService.getById(id);
        if (mounted && data) {
          setFormData({
            year: data.year || '',
            date: data.date ? data.date.split('T')[0] : '',
            title: data.title || '',
            slug: data.slug || '',
            era: data.era || 'giai-doan-1',
            summary: data.summary || '',
            content: data.content || '',
            coverImage: data.coverImage || null,
            gallery: Array.isArray(data.gallery) ? data.gallery : [],
            source: data.source || '',
            order: data.order ?? 0,
            featured: Boolean(data.featured),
            published: Boolean(data.published),
          });
          setSlugManuallyEdited(true);
        }
      } catch (err) {
        if (mounted) setErrorMessage(err.message || 'Không thể tải dữ liệu mốc lịch sử.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [id, isEdit]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: slugManuallyEdited ? prev.slug : slugify(newTitle),
    }));
  };

  const handleSubmit = async (publishStatus = true) => {
    if (!formData.title.trim()) {
      setErrorMessage('Vui lòng nhập tiêu đề mốc lịch sử.');
      return;
    }
    if (!formData.year.toString().trim()) {
      setErrorMessage('Vui lòng nhập năm mốc lịch sử.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const payload = {
      ...formData,
      published: publishStatus,
      order: Number(formData.order) || 0,
    };

    try {
      if (isEdit) {
        await adminMilestoneService.update(id, payload);
      } else {
        await adminMilestoneService.create(payload);
      }
      navigate('/admin/history');
    } catch (err) {
      setErrorMessage(err.message || 'Lưu dữ liệu thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <AdminLoading text="Đang tải thông tin mốc lịch sử..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AdminPageHeader
        title={isEdit ? 'Chỉnh Sửa Cột Mốc Lịch Sử' : 'Thêm Cột Mốc Lịch Sử Mới'}
        subtitle="Quản lý thông tin thời kỳ, năm sự kiện, ảnh tư liệu và nội dung mốc son"
        backTo="/admin/history"
        breadcrumb={[
          { label: 'Lịch sử truyền thống', to: '/admin/history' },
          { label: isEdit ? 'Chỉnh sửa' : 'Thêm mới' },
        ]}
      />

      {errorMessage && (
        <div className="mb-6 p-4 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Basic Information Card */}
        <div className="p-6 bg-white rounded-military border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#410202] border-b border-stone-100 pb-2">
            Thông tin mốc son
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                Năm sự kiện <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: 1975 hoặc 19XX"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                Ngày cụ thể (nếu có)
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                Giai đoạn lịch sử <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.era}
                onChange={(e) => setFormData({ ...formData, era: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded border border-stone-200 bg-white focus:border-[#D99C2B] focus:outline-none"
              >
                <option value="giai-doan-1">Giai đoạn I (19XX – 19XX)</option>
                <option value="giai-doan-2">Giai đoạn II (19XX – 19XX)</option>
                <option value="giai-doan-3">Giai đoạn III (19XX – 20XX)</option>
                <option value="giai-doan-4">Giai đoạn IV (20XX – Nay)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
              Tiêu đề mốc lịch sử <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Nhập tiêu đề mốc son lịch sử..."
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 text-sm rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
              Đường dẫn tĩnh (Slug)
            </label>
            <input
              type="text"
              placeholder="tieu-de-moc-lich-su"
              value={formData.slug}
              onChange={(e) => {
                setSlugManuallyEdited(true);
                setFormData({ ...formData, slug: e.target.value });
              }}
              className="w-full px-3 py-1.5 text-xs font-mono rounded border border-stone-200 bg-stone-50 focus:border-[#D99C2B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
              Tóm tắt ngắn gọn
            </label>
            <textarea
              rows="3"
              placeholder="Nhập đoạn tóm tắt sự kiện hiển thị trên thẻ timeline..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
              Nội dung chi tiết
            </label>
            <textarea
              rows="6"
              placeholder="Chi tiết toàn văn về mốc son và bối cảnh lịch sử..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                Nguồn tư liệu lưu trữ
              </label>
              <input
                type="text"
                placeholder="VD: Phòng Lưu trữ Tư liệu Nhà trường"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                Thứ tự sắp xếp (Order)
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Media Upload Section */}
        <div className="p-6 bg-white rounded-military border border-stone-200 shadow-xs space-y-6">
          <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#410202] border-b border-stone-100 pb-2">
            Tư liệu hình ảnh (Cloudinary)
          </h3>

          <ImageUploader
            label="Ảnh đại diện mốc son (Cover Image)"
            folder="history"
            value={formData.coverImage}
            onChange={(img) => setFormData({ ...formData, coverImage: img })}
          />

          <MultiImageUploader
            label="Bộ sưu tập ảnh tư liệu đi kèm (Gallery)"
            folder="history"
            images={formData.gallery}
            onChange={(imgs) => setFormData({ ...formData, gallery: imgs })}
          />
        </div>

        {/* Status & Options Card */}
        <div className="p-6 bg-white rounded-military border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#410202] border-b border-stone-100 pb-2">
            Tùy chọn hiển thị
          </h3>

          <div className="flex flex-col sm:flex-row gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-serif font-bold text-stone-700">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-[#D99C2B] focus:ring-[#D99C2B] border-stone-300"
              />
              <span>Đánh dấu mốc son tiêu biểu (Hiển thị trang chủ)</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 p-4 bg-stone-100 rounded-military border border-stone-200">
          <button
            type="button"
            disabled={submitting}
            onClick={() => navigate('/admin/history')}
            className="px-4 py-2 text-xs font-serif font-bold text-stone-600 hover:bg-stone-200 rounded transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit(false)}
              className="px-4 py-2 text-xs font-serif font-bold bg-white text-stone-700 hover:bg-stone-50 border border-stone-300 rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Lưu bản nháp</span>
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit(true)}
              className="px-5 py-2 text-xs font-serif font-bold bg-[#D99C2B] text-[#410202] hover:bg-[#D99C2B]/90 rounded shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isEdit ? 'Cập nhật mốc son' : 'Xuất bản mốc son'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default HistoryFormPage;
