import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Shield,
  Award,
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle,
  Upload,
  Loader2,
  X,
  RefreshCw,
} from 'lucide-react';
import battalionService from '../../../services/battalionService';
import mediaService from '../../../services/mediaService';

export function BattalionFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    fullName: '',
    emblemTitle: '',
    slogan: '',
    tradition: '',
    mission: '',
    stats: {
      established: '',
      highlight: '',
    },
    order: 1,
    posts: [],
  });

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Sub-form for adding a new activity post
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    category: 'Hoạt động phong trào',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    excerpt: '',
    author: '',
  });

  // State for image upload in modal
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEdit) {
      const loadItem = async () => {
        setLoading(true);
        try {
          const item = await battalionService.getById(id);
          if (item) {
            setFormData({
              code: item.code || item.id || '',
              name: item.name || '',
              fullName: item.fullName || '',
              emblemTitle: item.emblemTitle || '',
              slogan: item.slogan || '',
              tradition: item.tradition || '',
              mission: item.mission || '',
              stats: {
                established: item.stats?.established || '',
                highlight: item.stats?.highlight || '',
              },
              order: item.order ?? 1,
              posts: Array.isArray(item.posts) ? item.posts : [],
            });
          } else {
            setError('Không tìm thấy thông tin đơn vị tiểu đoàn.');
          }
        } catch (err) {
          setError('Lỗi khi tải dữ liệu tiểu đoàn: ' + err.message);
        } finally {
          setLoading(false);
        }
      };
      loadItem();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('stats.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        stats: { ...prev.stats, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError('');
    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const uploadedData = await mediaService.uploadImage(file, 'battalions', (percent) => {
        setUploadProgress(percent);
      });
      setNewPost((prev) => ({
        ...prev,
        imageUrl: uploadedData.url,
      }));
    } catch (err) {
      setImageError(err.message || 'Không thể tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPost.title.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết');
      return;
    }

    const postItem = {
      id: `p-${Date.now()}`,
      title: newPost.title.trim(),
      category: newPost.category.trim() || 'Hoạt động đơn vị',
      date: newPost.date || new Date().toISOString().split('T')[0],
      imageUrl:
        newPost.imageUrl.trim() ||
        'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
      excerpt: newPost.excerpt.trim(),
      author: newPost.author.trim() || `Ban Thông tin ${formData.name || 'Tiểu đoàn'}`,
    };

    setFormData((prev) => ({
      ...prev,
      posts: [postItem, ...prev.posts],
    }));

    setNewPost({
      title: '',
      category: 'Hoạt động phong trào',
      date: new Date().toISOString().split('T')[0],
      imageUrl: '',
      excerpt: '',
      author: '',
    });
    setImageError('');
    setShowPostModal(false);
  };

  const handleRemovePost = (postId) => {
    setFormData((prev) => ({
      ...prev,
      posts: prev.posts.filter((p) => p.id !== postId && p._id !== postId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên tiểu đoàn');
      return;
    }
    if (!formData.fullName.trim()) {
      setError('Vui lòng nhập tên đầy đủ của đơn vị');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // Clean posts before sending to avoid invalid _id casting
      const cleanedPosts = (formData.posts || []).map((p) => {
        const clean = { ...p };
        if (clean._id && !/^[0-9a-fA-F]{24}$/.test(String(clean._id))) {
          delete clean._id;
        }
        return clean;
      });

      const payload = {
        ...formData,
        order: Number(formData.order) || 1,
        posts: cleanedPosts,
      };

      if (isEdit) {
        await battalionService.update(id, payload);
        setSuccess('Đã cập nhật đơn vị tiểu đoàn thành công!');
      } else {
        await battalionService.create(payload);
        setSuccess('Đã thêm mới đơn vị tiểu đoàn thành công!');
      }

      setTimeout(() => {
        navigate('/admin/battalions');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu đơn vị tiểu đoàn');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 font-serif">
        Đang tải biểu mẫu...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/battalions"
          className="inline-flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider text-army-maroon hover:text-army-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách tiểu đoàn</span>
        </Link>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800 text-xs">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#410202] text-army-ivory p-6 rounded-lg border border-army-gold/30 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[10px] text-army-gold font-serif uppercase tracking-widest font-bold block mb-1">
            {isEdit ? 'Hiệu Chỉnh Hồ Sơ Đơn Vị' : 'Khởi Tạo Đơn Vị Mới'}
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-army-gold uppercase tracking-wider">
            {isEdit ? `Chỉnh Sửa: ${formData.name || 'Tiểu đoàn'}` : 'Thêm Mới Đơn Vị Tiểu Đoàn'}
          </h1>
        </div>
        <div className="w-12 h-12 rounded-full bg-army-black border border-army-gold flex items-center justify-center text-army-gold font-serif font-bold shadow-gold-glow shrink-0">
          <Shield className="w-6 h-6" />
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Thông tin cơ bản */}
        <div className="bg-white p-6 rounded-lg border border-army-gold/20 shadow-xs space-y-4">
          <h2 className="text-sm font-serif font-bold text-army-maroon uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-army-gold" />
            <span>1. Thông Tin Nhận Diện & Định Danh</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Tên hiển thị <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="VD: Tiểu đoàn 1"
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Mã viết tắt (Code)
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="VD: d1 hoặc tieu-doan-1"
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Thứ tự sắp xếp
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                placeholder="VD: 1"
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Tên đầy đủ đơn vị <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="VD: Tiểu đoàn Quản lý Học viên 1"
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Danh hiệu biểu trưng
              </label>
              <input
                type="text"
                name="emblemTitle"
                value={formData.emblemTitle}
                onChange={handleChange}
                placeholder="VD: Đơn vị Lá cờ đầu"
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Khẩu hiệu & Thành tích */}
        <div className="bg-white p-6 rounded-lg border border-army-gold/20 shadow-xs space-y-4">
          <h2 className="text-sm font-serif font-bold text-army-maroon uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-army-gold" />
            <span>2. Khẩu Hiệu & Thành Tích Tiêu Biểu</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Khẩu hiệu hành động
            </label>
            <input
              type="text"
              name="slogan"
              value={formData.slogan}
              onChange={handleChange}
              placeholder="VD: Đoàn kết – Kỷ luật – Kiên cường – Quyết thắng"
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold font-serif font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Lịch sử / Mốc hình thành
              </label>
              <input
                type="text"
                name="stats.established"
                value={formData.stats.established}
                onChange={handleChange}
                placeholder="VD: Gắn liền với các mốc phát triển vẻ vang của trường"
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Thành tích tiêu biểu
              </label>
              <input
                type="text"
                name="stats.highlight"
                value={formData.stats.highlight}
                onChange={handleChange}
                placeholder="VD: Nhiều năm liền đạt danh hiệu Đơn vị Quyết thắng"
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Nội dung truyền thống & Nhiệm vụ */}
        <div className="bg-white p-6 rounded-lg border border-army-gold/20 shadow-xs space-y-4">
          <h2 className="text-sm font-serif font-bold text-army-maroon uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-army-gold" />
            <span>3. Truyền Thống Vẻ Vang & Nhiệm Vụ Chính Trị</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Truyền thống vẻ vang (ngắn gọn, cô đọng)
            </label>
            <textarea
              name="tradition"
              value={formData.tradition}
              onChange={handleChange}
              rows={4}
              placeholder="Tóm tắt nét tiêu biểu trong bề dày lịch sử và phong trào thi đua của đơn vị..."
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold leading-relaxed resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Chức năng, nhiệm vụ chính trị
            </label>
            <textarea
              name="mission"
              value={formData.mission}
              onChange={handleChange}
              rows={3}
              placeholder="Nhiệm vụ quản lý, giáo dục, rèn luyện học viên..."
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Card 4: Bài đăng & Hình ảnh hoạt động của Tiểu đoàn */}
        <div className="bg-white p-6 rounded-lg border border-army-gold/20 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="text-sm font-serif font-bold text-army-maroon uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-army-gold" />
              <span>4. Danh Mục Bài Đăng & Hình Ảnh Hoạt Động ({formData.posts.length})</span>
            </h2>

            <button
              type="button"
              onClick={() => setShowPostModal(true)}
              className="px-3 py-1.5 rounded bg-army-maroon hover:bg-army-dark text-army-gold text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm bài đăng / ảnh</span>
            </button>
          </div>

          {formData.posts.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded border border-dashed border-gray-200 text-gray-400 text-xs">
              Chưa có bài đăng nào. Bấm nút "Thêm bài đăng / ảnh" ở trên để bổ sung hoạt động cho tiểu đoàn.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.posts.map((post, idx) => (
                <div
                  key={post.id || post._id || idx}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex gap-3 relative group hover:border-army-gold/40 transition-colors"
                >
                  <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden shrink-0 border border-gray-300">
                    <img
                      src={post.imageUrl || '/logo.png'}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/logo.png';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-army-gold/15 text-army-maroon border border-army-gold/30 mb-1">
                      {post.category || 'Hoạt động'}
                    </span>
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                      {post.excerpt}
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-1">
                      {post.date} &bull; {post.author}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemovePost(post.id || post._id)}
                    className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    title="Xóa bài viết này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Link
            to="/admin/battalions"
            className="px-5 py-2.5 rounded text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Hủy bỏ
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded bg-army-gold hover:bg-army-gold-light text-army-maroon font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-gold-glow transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Đang lưu...' : 'Lưu thông tin tiểu đoàn'}</span>
          </button>
        </div>
      </form>

      {/* Modal: Thêm bài đăng / ảnh hoạt động */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-2xl border border-army-gold/40 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-3.5 bg-army-maroon text-army-gold flex items-center justify-between border-b border-army-gold/30">
              <h3 className="font-serif font-bold text-xs uppercase tracking-wider">
                Thêm Bài Đăng / Ảnh Hoạt Động Của Tiểu Đoàn
              </h3>
              <button
                type="button"
                onClick={() => setShowPostModal(false)}
                className="text-army-ivory/70 hover:text-army-gold p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddPost} className="p-5 space-y-3 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Tiêu đề bài viết / sự kiện <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="VD: Hội thi cán bộ giảng bài chính trị cấp Tiểu đoàn"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Thể loại</label>
                  <input
                    type="text"
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    placeholder="VD: Huấn luyện quân sự, Học tập & Giảng dạy"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Ngày diễn ra</label>
                  <input
                    type="date"
                    value={newPost.date}
                    onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold"
                  />
                </div>
              </div>

              {/* Image Input Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-gray-700">
                    Ảnh bài viết / hoạt động
                  </label>
                  {newPost.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setNewPost({ ...newPost, imageUrl: '' })}
                      className="text-[11px] text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Xóa ảnh</span>
                    </button>
                  )}
                </div>

                {imageError && (
                  <div className="p-2 rounded bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{imageError}</span>
                  </div>
                )}

                {/* Upload Button + File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <button
                    type="button"
                    onClick={() => !uploadingImage && fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3 py-2 bg-army-maroon hover:bg-army-dark text-army-gold font-serif font-bold text-xs uppercase tracking-wider rounded border border-army-gold/30 flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-army-gold" />
                        <span>Đang tải... {uploadProgress > 0 ? `${uploadProgress}%` : ''}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Chọn ảnh từ máy</span>
                      </>
                    )}
                  </button>

                  <div className="flex-1">
                    <input
                      type="text"
                      value={newPost.imageUrl}
                      onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                      placeholder="Hoặc dán URL ảnh (https://...)"
                      className="w-full h-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold text-xs"
                    />
                  </div>
                </div>

                {/* Image Preview */}
                {newPost.imageUrl && (
                  <div className="mt-2 relative h-36 rounded bg-gray-100 overflow-hidden border border-gray-200 group">
                    <img
                      src={newPost.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/logo.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded bg-white/90 hover:bg-white text-gray-800 text-xs font-semibold flex items-center gap-1 shadow cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Thay ảnh khác</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tác giả / Đơn vị đăng</label>
                <input
                  type="text"
                  value={newPost.author}
                  onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                  placeholder={`Ban Thông tin ${formData.name || 'Tiểu đoàn'}`}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Tóm tắt nội dung bài viết
                </label>
                <textarea
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  rows={3}
                  placeholder="Mô tả kết quả, diễn biến chính của hoạt động..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-army-gold resize-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-3.5 py-1.5 rounded text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-army-gold text-army-maroon font-serif font-bold uppercase tracking-wider shadow-gold-glow"
                >
                  Thêm vào danh sách
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BattalionFormPage;
