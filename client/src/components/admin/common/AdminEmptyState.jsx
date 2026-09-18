import React from 'react';
import { Link } from 'react-router-dom';
import { Inbox, Plus } from 'lucide-react';

export function AdminEmptyState({
  title = 'Chưa có dữ liệu',
  message = 'Hiện tại chưa có bản ghi nào trong hệ thống.',
  createTo,
  createLabel = 'Thêm bản ghi đầu tiên',
}) {
  return (
    <div className="py-16 px-4 text-center bg-white rounded-military border border-stone-200 shadow-xs flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
        <Inbox className="w-7 h-7 text-[#410202]/60" />
      </div>
      <h3 className="font-serif font-bold text-[#241A18] text-base mb-1">
        {title}
      </h3>
      <p className="text-xs text-stone-500 max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      {createTo && (
        <Link
          to={createTo}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-serif font-bold bg-[#D99C2B] text-[#410202] hover:bg-[#D99C2B]/90 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{createLabel}</span>
        </Link>
      )}
    </div>
  );
}

export default AdminEmptyState;
