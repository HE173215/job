import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminNewsService from '../../../services/adminNewsService';
import ImageUploader from '../../../components/admin/media/ImageUploader';
import AdminPageHeader from '../../../components/admin/common/AdminPageHeader';
import AdminLoading from '../../../components/admin/common/AdminLoading';
import { slugify } from '../../../utils/slug';
import { Save, Loader2, AlertCircle } from 'lucide-react';

export function NewsFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Tags as comma string for UX editing
  const [tagsInput, setTagsInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Đào tạo',
    excerpt: '',
    content: '',
    thumbnail: null,
    tags: [],
    featured: false,
    published: true,
    publishedAt: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!isEdit) return;

    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const data = await adminNewsService.getById(id);
        if (mounted && data) {
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            category: data.category || 'Đào tạo',
            excerpt: data.excerpt || '',
            content: data.content || '',
            thumbnail: data.thumbnail || null,
            tags: Array.isArray(data.tags) ? data.tags : [],
            featured: Boolean(data.featured),
            published: Boolean(data.published),
            publishedAt: data.publishedAt ? data.publishedAt.split('T')[0] : '',
          });
          setTagsInput(Array.isArray(data.tags) ? data.tags.join(', ') : '');
          setSlugManuallyEdited(true);
        }
      } catch (err) {
        if (mounted) setErrorMessage(err.message || 'Không thể tải dữ liệu tin tức.');
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
      setErrorMessage('Vui lòng nhập tiêu đề bài viết.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    // Normalize tags string thành array
    const normalizedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      tags: normalizedTags,
      published: publishStatus,
    };

    try {
      if (isEdit) {
        await adminNewsService.update(id, payload);
      } else {
        await adminNewsService.create(payload);
      }
      navigate('/admin/news');
    } catch (err) {
      setErrorMessage(err.message || 'Lưu bài viết thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <AdminLoading text="Đang tải dữ liệu bài viết..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AdminPageHeader
        title={isEdit ? 'Chỉnh Sửa Tin Tức' : 'Thêm Bài Viết Mới'}
        subtitle="Soạn thảo thông tin giáo dục đào tạo, hoạt động và bài viết chuyên đề"
        backTo="/admin/news"
        breadcrumb={[
          { label: 'Tin tức', to: '/admin/news' },
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
        <div className="p-6 bg-white rounded-military border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#410202] border-b border-stone-100 pb-2">
            Nội dung bài viết
          </h3>

          <div>
            <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
              Tiêu đề bài viết <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Nhập tiêu đề bài viết..."
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
                placeholder="tieu-de-bai-viet"
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
                Chuyên mục
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded border border-stone-200 bg-white focus:border-[#D99C2B] focus:outline-none"
              >
                <option value="Đào tạo">Giáo dục & Đào tạo</option>
                <option value="Thi đua">Phong trào thi đua</option>
                <option value="Nghiên cứu">Nghiên cứu khoa học</option>
                <option value="Dân vận">Công tác dân vận</option>
                <option value="Thông báo">Thông báo chính thức</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
              Trích dẫn ngắn gọn (Excerpt)
            </label>
            <textarea
              rows="3"
              placeholder="Mô tả tóm tắt nội dung bài viết..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
              Nội dung toàn văn
            </label>
            <textarea
              rows="8"
              placeholder="Nội dung chi tiết của bài viết..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                Tags (Phân cách bởi dấu phẩy)
              </label>
              <input
                type="text"
                placeholder="đào tạo, thi đua, sự kiện..."
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                Ngày xuất bản
              </label>
              <input
                type="date"
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Thumbnail Card */}
        <div className="p-6 bg-white rounded-military border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#410202] border-b border-stone-100 pb-2">
            Ảnh đại diện bài viết
          </h3>
          <ImageUploader
            label="Ảnh Thumbnail"
            folder="news"
            value={formData.thumbnail}
            onChange={(img) => setFormData({ ...formData, thumbnail: img })}
          />
        </div>

        {/* Status Options */}
        <div className="p-6 bg-white rounded-military border border-stone-200 shadow-xs">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-serif font-bold text-stone-700">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-[#D99C2B] focus:ring-[#D99C2B] border-stone-300"
            />
            <span>Đánh dấu tin tức nổi bật (Hiển thị trang chủ)</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3 p-4 bg-stone-100 rounded-military border border-stone-200">
          <button
            type="button"
            disabled={submitting}
            onClick={() => navigate('/admin/news')}
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
              <span>{isEdit ? 'Cập nhật tin' : 'Xuất bản bài viết'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default NewsFormPage;
