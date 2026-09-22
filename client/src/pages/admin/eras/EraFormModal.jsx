import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

export function EraFormModal({ isOpen, onClose, onSave, initialData, defaultOrder = 1 }) {
  const [formData, setFormData] = useState({
    name: '',
    timeframe: '',
    title: '',
    startYear: '',
    endYear: '',
    order: defaultOrder,
    quote: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        timeframe: initialData.timeframe || '',
        title: initialData.title || '',
        startYear: initialData.startYear ?? '',
        endYear: initialData.endYear ?? '',
        order: initialData.order ?? defaultOrder,
        quote: initialData.quote || '',
        description: initialData.description || '',
      });
    } else {
      setFormData({
        name: '',
        timeframe: '',
        title: '',
        startYear: '',
        endYear: '',
        order: defaultOrder,
        quote: '',
        description: '',
      });
    }
    setError('');
  }, [initialData, isOpen, defaultOrder]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'timeframe') {
        const years = value.match(/\b\d{4}\b/g);
        if (years && years.length >= 1) {
          if (!prev.startYear) next.startYear = years[0];
          if (!prev.endYear && years.length >= 2) next.endYear = years[1];
        }
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên giai đoạn (ví dụ: Giai đoạn I)');
      return;
    }
    if (!formData.timeframe.trim()) {
      setError('Vui lòng nhập khoảng thời gian (ví dụ: 1951 – 1975)');
      return;
    }
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề giai đoạn');
      return;
    }
    if (formData.title.trim().length < 3) {
      setError('Tiêu đề giai đoạn phải có ít nhất 3 ký tự');
      return;
    }
    if (!formData.startYear || isNaN(Number(formData.startYear))) {
      setError('Năm bắt đầu phải là số hợp lệ');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSave({
        ...formData,
        startYear: Number(formData.startYear),
        endYear: formData.endYear ? Number(formData.endYear) : 9999,
        order: Number(formData.startYear) || 1,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi lưu giai đoạn');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#1A0303] text-army-ivory border border-army-gold/40 rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-army-gold/30 flex items-center justify-between bg-army-maroon/60">
          <h2 className="text-lg font-serif font-bold text-army-gold uppercase tracking-wider">
            {initialData ? 'Chỉnh Sửa Giai Đoạn Lịch Sử' : 'Thêm Giai Đoạn Lịch Sử Mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-army-ivory/70 hover:text-army-gold p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded flex items-center gap-2 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-army-gold uppercase tracking-wider mb-1">
                Tên giai đoạn <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="VD: Giai đoạn I"
                className="w-full px-3 py-2 bg-black/40 border border-army-gold/30 rounded text-sm text-army-white focus:outline-none focus:border-army-gold transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-army-gold uppercase tracking-wider mb-1">
                Khoảng thời gian <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="timeframe"
                value={formData.timeframe}
                onChange={handleChange}
                placeholder="VD: 1951 – 1975 hoặc 2008 – Nay"
                className="w-full px-3 py-2 bg-black/40 border border-army-gold/30 rounded text-sm text-army-white focus:outline-none focus:border-army-gold transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-army-gold uppercase tracking-wider mb-1">
              Tiêu đề chính <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="VD: Thành lập & Kháng chiến giải phóng dân tộc"
              className="w-full px-3 py-2 bg-black/40 border border-army-gold/30 rounded text-sm text-army-white focus:outline-none focus:border-army-gold transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-army-gold uppercase tracking-wider mb-1">
                Năm bắt đầu <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="startYear"
                value={formData.startYear}
                onChange={handleChange}
                placeholder="VD: 1951"
                className="w-full px-3 py-2 bg-black/40 border border-army-gold/30 rounded text-sm text-army-white focus:outline-none focus:border-army-gold transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-army-gold uppercase tracking-wider mb-1">
                Năm kết thúc
              </label>
              <input
                type="number"
                name="endYear"
                value={formData.endYear === 9999 ? '' : formData.endYear}
                onChange={handleChange}
                placeholder="VD: 1975 (để trống nếu đến nay)"
                className="w-full px-3 py-2 bg-black/40 border border-army-gold/30 rounded text-sm text-army-white focus:outline-none focus:border-army-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-army-gold uppercase tracking-wider mb-1">
              Khẩu hiệu / Trích dẫn ý nghĩa
            </label>
            <input
              type="text"
              name="quote"
              value={formData.quote}
              onChange={handleChange}
              placeholder="VD: Mỗi cán bộ chính trị là một ngọn cờ dẫn dắt tinh thần bộ đội."
              className="w-full px-3 py-2 bg-black/40 border border-army-gold/30 rounded text-sm text-army-white focus:outline-none focus:border-army-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-army-gold uppercase tracking-wider mb-1">
              Mô tả chi tiết bối cảnh lịch sử
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Tóm tắt ý nghĩa, sự kiện cốt lõi của giai đoạn..."
              className="w-full px-3 py-2 bg-black/40 border border-army-gold/30 rounded text-sm text-army-white focus:outline-none focus:border-army-gold transition-colors resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-army-gold/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs font-semibold text-army-ivory/80 hover:text-army-white hover:bg-white/10 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded bg-army-gold hover:bg-army-gold-light text-army-maroon font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-gold-glow transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang lưu...' : 'Lưu giai đoạn'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EraFormModal;
