import React from 'react';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';
import { Shield, Award, Users, BookOpen } from 'lucide-react';

export function IntroductionPage() {
  return (
    <div className="py-16 bg-dark-section min-h-screen">
      <Container>
        <SectionTitle
          badge="CƠ CẤU & TỔ CHỨC"
          title="GIỚI THIỆU TRƯỜNG SĨ QUAN CHÍNH TRỊ"
          subtitle="Tổng quan về vị thế, chức năng nhiệm vụ và hệ thống các khoa giáo viên, đơn vị trực thuộc."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 rounded-military bg-army-maroon/60 border border-army-gold/30 shadow-card-dark">
            <h3 className="text-xl font-serif font-bold text-army-gold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Chức năng & Nhiệm vụ
            </h3>
            <p className="text-sm text-army-ivory/85 leading-relaxed mb-4">
              Trường Sĩ quan Chính trị là trung tâm giáo dục, đào tạo sĩ quan chính trị cấp phân đội; đào tạo giáo viên khoa học xã hội và nhân văn quân sự bậc đại học và sau đại học; bồi dưỡng cán bộ chính trị và nghiên cứu khoa học lý luận chính trị phục vụ quân đội.
            </p>
            <p className="text-sm text-army-ivory/85 leading-relaxed">
              Nhà trường chịu sự lãnh đạo trực tiếp của Quân ủy Trung ương, sự chỉ đạo của Bộ Quốc phòng và hướng dẫn của Tổng cục Chính trị Quân đội nhân dân Việt Nam.
            </p>
          </div>

          <div className="p-8 rounded-military bg-army-maroon/60 border border-army-gold/30 shadow-card-dark">
            <h3 className="text-xl font-serif font-bold text-army-gold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Mục tiêu đào tạo
            </h3>
            <p className="text-sm text-army-ivory/85 leading-relaxed mb-4">
              Xây dựng đội ngũ sĩ quan chính trị có phẩm chất chính trị kiên định, tuyệt đối trung thành với Tổ quốc; có kiến thức toàn diện về khoa học quân sự, khoa học xã hội nhân văn; nắm vững nguyên tắc, phương pháp tiến hành công tác đảng, công tác chính trị trong quân đội.
            </p>
            <p className="text-sm text-army-ivory/85 leading-relaxed">
              Chuẩn đầu ra đáp ứng yêu cầu người chỉ trị viên phân đội mẫu mực, người thầy mẫu mực, người đồng chí chân thành.
            </p>
          </div>
        </div>

        {/* Notice on unverified detail data */}
        <div className="p-4 rounded bg-army-black/60 border border-army-gold/20 text-center text-xs text-army-muted">
          [Ghi chú quy chuẩn]: Danh mục ban giám hiệu, biểu đồ tổ chức chi tiết đang được cập nhật chính thức từ cơ quan văn thư Nhà trường.
        </div>
      </Container>
    </div>
  );
}

export default IntroductionPage;
