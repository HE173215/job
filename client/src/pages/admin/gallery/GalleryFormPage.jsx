import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminGalleryService from '../../../services/adminGalleryService';
import ImageUploader from '../../../components/admin/media/ImageUploader';
import MultiImageUploader from '../../../components/admin/media/MultiImageUploader';
import AdminPageHeader from '../../../components/admin/common/AdminPageHeader';
import AdminLoading from '../../../components/admin/common/AdminLoading';
import { slugify } from '../../../utils/slug';
import { Save, Loader2, AlertCircle } from 'lucide-react';

export function GalleryFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    coverImage: null,
    images: [],
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
        const data = await adminGalleryService.getById(id);
        if (mounted && data) {
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            description: data.description || '',
            coverImage: data.coverImage || null,
            images: Array.isArray(data.images) ? data.images : [],
            order: data.order ?? 0,
            featured: Boolean(data.featured),
            published: Boolean(data.published),
          });
          setSlugManuallyEdited(true);
        }
      } catch (err) {
        if (mounted) setErrorMessage(err.message || 'Không thể tải dữ liệu album ảnh.');
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
      setErrorMessage('Vui lòng nhập tên album ảnh.');
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
        await adminGalleryService.update(id, payload);
      } else {
        await adminGalleryService.create(payload);
      }
      navigate('/admin/gallery');
    } catch (err) {
      setErrorMessage(err.message || 'Lưu album ảnh thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <AdminLoading text="Đang tải dữ liệu album ảnh..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AdminPageHeader
        title={isEdit ? 'Chỉnh Sửa Album Ảnh' : 'Tạo Album Ảnh Mới'}
        subtitle="Quản lý kho tư liệu ảnh truyền thống, ảnh hoạt động và hình ảnh lịch sử"
        backTo="/admin/gallery"
        breadcrumb={[
          { label: 'Thư viện ảnh', to: '/admin/gallery' },
          { label: isEdit ? 'Chỉnh sửa' : 'Tạo mới' },
        ]}
      />

      {errorMessage && (
        <div className="mb-6 p-4 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="p-6 bg-white rounded-military border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#410202] border-b border-stone-100 pb-2">
            Thông tin album
          </h3>

          <div>
            <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
              Tên album ảnh <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Nhập tên album ảnh..."
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 text-sm rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                Đường dẫn tĩnh (Slug)
              </label>
              <input
                type="text"
                placeholder="ten-album-anh"
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
                Thứ tự sắp xếp
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
              Mô tả ngắn về album
            </label>
            <textarea
              rows="3"
              placeholder="Mô tả bối cảnh hoặc chủ đề của bộ sưu tập ảnh..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
            />
          </div>
        </div>

        {/* Media */}
        <div className="p-6 bg-white rounded-military border border-stone-200 shadow-xs space-y-6">
          <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#410202] border-b border-stone-100 pb-2">
            Hình ảnh album (Cloudinary)
          </h3>

          <ImageUploader
            label="Ảnh bìa album (Cover Image)"
            folder="gallery"
            value={formData.coverImage}
            onChange={(img) => setFormData({ ...formData, coverImage: img })}
          />

          <MultiImageUploader
            label="Danh sách hình ảnh trong album (Images)"
            folder="gallery"
            images={formData.images}
            onChange={(imgs) => setFormData({ ...formData, images: imgs })}
          />
        </div>

        {/* Status */}
        <div className="p-6 bg-white rounded-military border border-stone-200 shadow-xs">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-serif font-bold text-stone-700">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-[#D99C2B] focus:ring-[#D99C2B] border-stone-300"
            />
            <span>Đánh dấu album nổi bật</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 p-4 bg-stone-100 rounded-military border border-stone-200">
          <button
            type="button"
            disabled={submitting}
            onClick={() => navigate('/admin/gallery')}
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
              <span>{isEdit ? 'Cập nhật album' : 'Xuất bản album'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default GalleryFormPage;
