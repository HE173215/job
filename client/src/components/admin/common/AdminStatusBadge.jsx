import React from 'react';
import { CheckCircle2, FileEdit, Star } from 'lucide-react';

export function AdminStatusBadge({ published = false, featured = false }) {
  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      {published ? (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          <span>Đã xuất bản</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
          <FileEdit className="w-3 h-3" />
          <span>Bản nháp</span>
        </span>
      )}

      {featured && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
          <span>Nổi bật</span>
        </span>
      )}
    </div>
  );
}

export default AdminStatusBadge;
