import React from 'react';
import { ShieldAlert, Home } from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-dark-section py-20 text-center">
      <Container className="max-w-md">
        <div className="w-20 h-20 rounded-full bg-army-maroon border-2 border-army-gold mx-auto flex items-center justify-center text-army-gold mb-6 shadow-gold-glow">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <span className="text-4xl sm:text-5xl font-serif font-extrabold text-army-gold tracking-widest block mb-2">
          404
        </span>
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-army-white mb-3">
          Không tìm thấy trang yêu cầu
        </h1>
        <p className="text-sm text-army-muted mb-8 leading-relaxed">
          Đường dẫn không tồn tại hoặc nội dung đang trong quá trình chuyển đổi vị trí lưu trữ trong hệ thống thông tin.
        </p>
        <Button to="/" variant="primary" size="md" icon={Home}>
          Quay lại Trang chủ
        </Button>
      </Container>
    </div>
  );
}

export default NotFoundPage;
