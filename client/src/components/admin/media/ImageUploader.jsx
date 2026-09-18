import React, { useState, useRef } from 'react';
import mediaService from '../../../services/mediaService';
import { Upload, X, RefreshCw, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';

export function ImageUploader({
  value = null, // { publicId, url, alt, caption }
  onChange,
  folder = 'history',
  label = 'Ảnh đại diện',
  required = false,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const uploadedData = await mediaService.uploadImage(file, folder, (percent) => {
        setProgress(percent);
      });

      // Giữ nguyên alt/caption cũ nếu có
      onChange({
        ...uploadedData,
        alt: value?.alt || uploadedData.alt || '',
        caption: value?.caption || uploadedData.caption || '',
      });
    } catch (err) {
      setError(err.message || 'Không thể tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setError('');
    onChange(null);
  };

  const handleAltChange = (e) => {
    if (value) {
      onChange({ ...value, alt: e.target.value });
    }
  };

  const handleCaptionChange = (e) => {
    if (value) {
      onChange({ ...value, caption: e.target.value });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs uppercase tracking-wider font-serif font-bold text-[#410202]">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        {value?.url && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Xóa ảnh</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Area / Preview */}
      {!value?.url ? (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-military p-6 text-center cursor-pointer transition-colors ${
            uploading
              ? 'bg-stone-50 border-stone-300 cursor-not-allowed'
              : 'border-stone-300 hover:border-[#D99C2B] bg-white hover:bg-stone-50/80'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-8 h-8 text-[#D99C2B] animate-spin" />
              <p className="text-xs font-serif font-bold text-[#410202]">
                Đang tải ảnh lên Cloudinary... {progress > 0 && `${progress}%`}
              </p>
              {progress > 0 && (
                <div className="w-48 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D99C2B] transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                <Upload className="w-5 h-5 text-[#410202]" />
              </div>
              <p className="text-xs font-serif font-bold text-[#241A18]">
                Nhấn để chọn ảnh tải lên
              </p>
              <p className="text-[11px] text-stone-500">
                Hỗ trợ JPG, PNG, WEBP (Tối đa 10MB)
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 bg-white border border-stone-200 rounded-military shadow-xs space-y-3">
          <div className="relative aspect-[16/10] max-h-48 overflow-hidden rounded bg-stone-100 flex items-center justify-center border border-stone-200">
            <img
              src={value.url}
              alt={value.alt || 'Ảnh xem trước'}
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Đang thay ảnh...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-2.5 py-1 text-xs font-serif font-semibold text-[#410202] bg-stone-100 hover:bg-stone-200 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Thay ảnh khác</span>
            </button>
            <span className="text-[11px] text-stone-400">
              {value.format?.toUpperCase()} {value.width ? `• ${value.width}x${value.height}` : ''}
            </span>
          </div>

          {/* Alt & Caption Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                Alt text (Mô tả ảnh cho SEO)
              </label>
              <input
                type="text"
                value={value.alt || ''}
                onChange={handleAltChange}
                placeholder="Nhập mô tả hình ảnh..."
                className="w-full px-2.5 py-1.5 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                Chú thích ảnh (Caption)
              </label>
              <input
                type="text"
                value={value.caption || ''}
                onChange={handleCaptionChange}
                placeholder="Nhập chú thích hiển thị..."
                className="w-full px-2.5 py-1.5 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
