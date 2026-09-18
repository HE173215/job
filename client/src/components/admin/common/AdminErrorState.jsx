import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export function AdminErrorState({
  message = 'Không thể tải dữ liệu. Vui lòng thử lại.',
  onRetry,
}) {
  return (
    <div className="py-14 px-4 text-center bg-white rounded-military border border-red-200 shadow-xs flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="font-serif font-bold text-[#241A18] text-sm sm:text-base mb-1">
        Đã xảy ra lỗi
      </h3>
      <p className="text-xs text-stone-600 max-w-sm mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-serif font-bold text-[#410202] bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Thử lại</span>
        </button>
      )}
    </div>
  );
}

export default AdminErrorState;
