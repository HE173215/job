import React from 'react';
import { Loader2 } from 'lucide-react';

export function AdminLoading({ text = 'Đang tải dữ liệu...' }) {
  return (
    <div className="py-16 text-center bg-white rounded-military border border-stone-200 shadow-xs flex flex-col items-center justify-center space-y-3">
      <Loader2 className="w-8 h-8 text-[#D99C2B] animate-spin" />
      <span className="text-xs font-serif font-bold text-[#410202] tracking-wider uppercase">
        {text}
      </span>
    </div>
  );
}

export default AdminLoading;
