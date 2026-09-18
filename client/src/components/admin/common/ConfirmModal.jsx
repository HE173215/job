import React, { useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export function ConfirmModal({
  isOpen,
  title = 'Xác nhận xóa nội dung',
  message = 'Bạn có chắc chắn muốn xóa bản ghi này? Thao tác này không thể hoàn tác.',
  confirmText = 'Xóa dữ liệu',
  cancelText = 'Hủy bỏ',
  onConfirm,
  onClose,
  loading = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-military border border-stone-200 shadow-2xl p-6 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-[#241A18] text-base leading-tight">
              {title}
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 text-xs font-serif font-bold text-stone-700 hover:bg-stone-100 rounded transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-serif font-bold text-white bg-red-700 hover:bg-red-800 rounded transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
