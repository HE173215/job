import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function AdminPagination({
  page = 1,
  totalPages = 1,
  total = 0,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200 text-xs text-stone-600">
      <div>
        <span>
          Hiển thị trang <strong className="text-[#241A18]">{page}</strong> trên{' '}
          <strong className="text-[#241A18]">{totalPages}</strong> ({total} bản ghi)
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-2.5 py-1.5 rounded border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Trước</span>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .map((p, idx, arr) => {
            const prev = arr[idx - 1];
            return (
              <React.Fragment key={p}>
                {prev && p - prev > 1 && <span className="px-1 text-stone-400">...</span>}
                <button
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={`min-w-[32px] h-8 rounded text-xs font-serif font-bold transition-colors cursor-pointer ${
                    p === page
                      ? 'bg-[#410202] text-[#D99C2B] border border-[#D99C2B]'
                      : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {p}
                </button>
              </React.Fragment>
            );
          })}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-2.5 py-1.5 rounded border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
        >
          <span>Sau</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default AdminPagination;
