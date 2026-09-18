import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export function AdminPageHeader({
  title,
  subtitle,
  breadcrumb = [],
  action,
  backTo,
}) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-stone-200">
      <div>
        {/* Breadcrumb */}
        {breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
            <Link to="/admin" className="hover:text-[#410202]">
              Admin
            </Link>
            {breadcrumb.map((item, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-stone-400" />
                {item.to ? (
                  <Link to={item.to} className="hover:text-[#410202]">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[#241A18] font-semibold">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Title */}
        <div className="flex items-center gap-2.5">
          {backTo && (
            <Link
              to={backTo}
              className="p-1.5 rounded-sm hover:bg-stone-200 text-stone-600 transition-colors"
              title="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
          <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-[#241A18] tracking-tight">
            {title}
          </h1>
        </div>

        {subtitle && (
          <p className="text-xs text-stone-500 mt-1">{subtitle}</p>
        )}
      </div>

      {/* Action Button */}
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default AdminPageHeader;
