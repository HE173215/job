import React, { useState, useRef } from 'react';
import mediaService from '../../../services/mediaService';
import { Upload, X, ArrowUp, ArrowDown, Loader2, AlertCircle, Plus } from 'lucide-react';

export function MultiImageUploader({
  images = [], // Array of { publicId, url, alt, caption, order }
  onChange,
  folder = 'history',
  label = 'Bộ sưu tập ảnh tư liệu (Gallery)',
}) {
  const fileInputRef = useRef(null);
  const [uploadingQueue, setUploadingQueue] = useState([]); // List of filenames currently uploading
  const [error, setError] = useState('');

  const handleFilesSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError('');
    const newItems = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempId = `uploading-${Date.now()}-${i}`;
      setUploadingQueue((prev) => [...prev, file.name]);

      try {
        const uploaded = await mediaService.uploadImage(file, folder);
        newItems.push({
          ...uploaded,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          caption: '',
          order: newItems.length + 1,
        });
        onChange([...newItems]);
      } catch (err) {
        setError(`Lỗi khi tải ảnh ${file.name}: ${err.message}`);
      } finally {
        setUploadingQueue((prev) => prev.filter((name) => name !== file.name));
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index) => {
    const updated = images.filter((_, i) => i !== index);
    // Cập nhật lại order tuần tự
    const reordered = updated.map((img, idx) => ({ ...img, order: idx + 1 }));
    onChange(reordered);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated.map((img, idx) => ({ ...img, order: idx + 1 })));
  };

  const handleMoveDown = (index) => {
    if (index === images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated.map((img, idx) => ({ ...img, order: idx + 1 })));
  };

  const handleFieldChange = (index, field, val) => {
    const updated = [...images];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs uppercase tracking-wider font-serif font-bold text-[#410202]">
          {label} ({images.length} ảnh)
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-serif font-bold text-[#410202] bg-[#D99C2B]/20 hover:bg-[#D99C2B] hover:text-[#410202] border border-[#D99C2B]/50 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm ảnh mới</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFilesSelect}
        className="hidden"
      />

      {error && (
        <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Uploading Queue Status */}
      {uploadingQueue.length > 0 && (
        <div className="p-3 bg-stone-100 rounded border border-stone-200 flex items-center gap-2 text-xs text-[#410202]">
          <Loader2 className="w-4 h-4 animate-spin text-[#D99C2B]" />
          <span>
            Đang tải lên {uploadingQueue.length} ảnh ({uploadingQueue.join(', ')})...
          </span>
        </div>
      )}

      {/* Images List / Grid */}
      {images.length === 0 && uploadingQueue.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-stone-300 hover:border-[#D99C2B] rounded-military p-6 text-center cursor-pointer bg-white hover:bg-stone-50/80 transition-colors"
        >
          <Upload className="w-6 h-6 text-stone-400 mx-auto mb-2" />
          <p className="text-xs font-serif font-bold text-[#241A18]">
            Chọn một hoặc nhiều ảnh để tải lên thư viện
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            Hỗ trợ JPG, PNG, WEBP (Mỗi ảnh tối đa 10MB)
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {images.map((item, idx) => (
            <div
              key={item.publicId || idx}
              className="p-3 bg-white border border-stone-200 rounded-military shadow-xs flex flex-col justify-between space-y-2.5"
            >
              {/* Image Preview + Order Controls */}
              <div className="relative aspect-[16/10] overflow-hidden rounded bg-stone-100 border border-stone-200">
                <img
                  src={item.url}
                  alt={item.alt || `Ảnh ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-white font-serif font-bold text-[10px]">
                  #{idx + 1}
                </span>
                <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveUp(idx)}
                    className="p-1 rounded bg-black/60 text-white hover:bg-[#D99C2B] hover:text-[#410202] disabled:opacity-30 cursor-pointer"
                    title="Đẩy lên trước"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={() => handleMoveDown(idx)}
                    className="p-1 rounded bg-black/60 text-white hover:bg-[#D99C2B] hover:text-[#410202] disabled:opacity-30 cursor-pointer"
                    title="Đẩy xuống sau"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1 rounded bg-red-600/90 text-white hover:bg-red-700 cursor-pointer"
                    title="Xóa ảnh này"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Alt & Caption inputs */}
              <div className="space-y-1.5 text-xs">
                <input
                  type="text"
                  value={item.alt || ''}
                  onChange={(e) => handleFieldChange(idx, 'alt', e.target.value)}
                  placeholder="Mô tả alt..."
                  className="w-full px-2 py-1 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
                />
                <input
                  type="text"
                  value={item.caption || ''}
                  onChange={(e) => handleFieldChange(idx, 'caption', e.target.value)}
                  placeholder="Chú thích ảnh..."
                  className="w-full px-2 py-1 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultiImageUploader;
