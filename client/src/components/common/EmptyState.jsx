import React from 'react';
import { Bookmark } from 'lucide-react';

export function EmptyState({
  message = 'Thông tin đang được cập nhật.',
  description = 'Dữ liệu đang được biên soạn và cập nhật từ hệ thống thông tin của Nhà trường.',
  icon: Icon = Bookmark,
  children,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-army-maroon/60 border border-army-gold/30 flex items-center justify-center text-army-gold mb-4 shadow-gold-glow">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-serif text-army-gold font-bold mb-2">
        {message}
      </h3>
      {description && (
        <p className="text-army-muted text-sm max-w-md mb-4">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

export default EmptyState;
