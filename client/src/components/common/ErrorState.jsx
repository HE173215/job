import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import Button from './Button';

export function ErrorState({
  message = 'Không thể tải dữ liệu. Vui lòng thử lại.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-army-red/40 border border-army-red-light/60 flex items-center justify-center text-army-gold mb-4 shadow-[0_0_15px_rgba(115,2,3,0.5)]">
        <AlertTriangle className="w-8 h-8 text-army-gold" />
      </div>
      <h3 className="text-xl font-serif text-army-gold font-bold mb-2">
        {message}
      </h3>
      <p className="text-army-muted text-sm max-w-md mb-6">
        Hệ thống không thể thiết lập kết nối tới cổng dịch vụ. Vui lòng kiểm tra lại đường truyền mạng hoặc thử lại sau giây lát.
      </p>
      {onRetry && (
        <Button
          variant="secondary"
          size="md"
          icon={RotateCcw}
          onClick={onRetry}
        >
          Thử lại
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
