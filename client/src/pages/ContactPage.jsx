import React from 'react';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Button from '../components/common/Button';

export function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Hệ thống tiếp nhận thông tin đang cập nhật.');
  };

  return (
    <div className="py-16 bg-dark-section min-h-screen">
      <Container>
        <SectionTitle
          badge="TIẾP NHẬN THÔNG TIN"
          title="LIÊN HỆ TRƯỜNG SĨ QUAN CHÍNH TRỊ"
          subtitle="Cơ quan thường trực tiếp nhận ý kiến đóng góp, liên hệ công tác và thủ tục hành chính quân sự."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Details */}
          <div className="p-8 rounded-military bg-army-maroon/60 border border-army-gold/30 shadow-card-dark">
            <h3 className="font-serif font-bold text-army-gold text-xl mb-6">
              Thông tin liên lạc chính thức
            </h3>

            <div className="space-y-6 text-sm text-army-ivory/90">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-army-black border border-army-gold/40 flex items-center justify-center text-army-gold shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-army-white mb-1">Địa chỉ trụ sở:</h4>
                  <p className="text-xs text-army-muted leading-relaxed">
                    [Đang cập nhật địa chỉ chính thức theo văn bản của Bộ Quốc phòng]
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-army-black border border-army-gold/40 flex items-center justify-center text-army-gold shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-army-white mb-1">Điện thoại cơ quan:</h4>
                  <p className="text-xs text-army-muted leading-relaxed">
                    [Đang cập nhật số máy trực ban tác chiến]
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-army-black border border-army-gold/40 flex items-center justify-center text-army-gold shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-army-white mb-1">Thư điện tử quân sự:</h4>
                  <p className="text-xs text-army-muted leading-relaxed">
                    [congthongtin@sqct.bqp.vn - Hòm thư mẫu]
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-army-black border border-army-gold/40 flex items-center justify-center text-army-gold shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-army-white mb-1">Thời gian làm việc:</h4>
                  <p className="text-xs text-army-muted leading-relaxed">
                    Thứ Hai – Thứ Sáu (Giờ hành chính quân đội)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 rounded-military bg-army-maroon/60 border border-army-gold/30 shadow-card-dark">
            <h3 className="font-serif font-bold text-army-gold text-xl mb-6">
              Gửi thông tin / Ý kiến phản hồi
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-army-gold font-semibold mb-1.5">
                  Họ và tên
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập họ và tên..."
                  className="w-full px-4 py-2.5 rounded-sm bg-army-black/70 border border-army-gold/30 text-army-white placeholder:text-army-muted/50 focus:border-army-gold focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-army-gold font-semibold mb-1.5">
                  Số điện thoại / Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập phương thức liên hệ..."
                  className="w-full px-4 py-2.5 rounded-sm bg-army-black/70 border border-army-gold/30 text-army-white placeholder:text-army-muted/50 focus:border-army-gold focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-army-gold font-semibold mb-1.5">
                  Nội dung liên hệ
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Nhập nội dung cần trao đổi hoặc đóng góp ý kiến..."
                  className="w-full px-4 py-2.5 rounded-sm bg-army-black/70 border border-army-gold/30 text-army-white placeholder:text-army-muted/50 focus:border-army-gold focus:outline-none text-sm resize-none"
                />
              </div>

              <Button type="submit" variant="primary" size="md" icon={Send} className="w-full">
                Gửi thông tin liên hệ
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ContactPage;
