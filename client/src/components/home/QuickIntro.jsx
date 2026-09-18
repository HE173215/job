import React from 'react';
import { GraduationCap, BookOpen, ShieldCheck, Award } from 'lucide-react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';

export function QuickIntro() {
  const pillars = [
    {
      icon: GraduationCap,
      title: 'Đào tạo cán bộ chính trị',
      desc: 'Đào tạo học viên sĩ quan chính trị cấp phân đội có bản lĩnh vững vàng, phẩm chất đạo đức trong sáng và năng lực lãnh đạo toàn diện.',
    },
    {
      icon: BookOpen,
      title: 'Nghiên cứu khoa học lý luận',
      desc: 'Trung tâm nghiên cứu khoa học xã hội nhân văn quân sự, góp phần cung cấp luận cứ khoa học cho sự nghiệp xây dựng quân đội về chính trị.',
    },
    {
      icon: ShieldCheck,
      title: 'Chính quy – Kỷ luật thép',
      desc: 'Môi trường sư phạm mẫu mực, duy trì nền nếp chính quy, rèn luyện lễ tiết tác phong chuẩn mực của người cán bộ mẫu mực.',
    },
    {
      icon: Award,
      title: 'Truyền thống vẻ vang',
      desc: 'Kế thừa và phát huy truyền thống anh hùng, kiên định lý tưởng cách mạng, trung thành tuyệt đối với Đảng, Tổ quốc và Nhân dân.',
    },
  ];

  return (
    <section id="home-intro" className="py-20 bg-dark-section border-b border-army-gold/20">
      <Container>
        <SectionTitle
          badge="SỨ MỆNH & VỊ THẾ"
          title="NỀN TẢNG VỮNG CHẮC – TÔI RÈN BẢN LĨNH"
          subtitle="Những trụ cột cốt lõi làm nên sức mạnh và uy tín vẻ vang của Trường Sĩ quan Chính trị trong hệ thống nhà trường quân đội."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 sm:p-7 rounded-military bg-army-maroon/50 border border-army-gold/25 hover:border-army-gold transition-all duration-300 shadow-card-dark hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Icon Circle */}
                  <div className="w-12 h-12 rounded-full bg-army-black border border-army-gold/40 flex items-center justify-center text-army-gold mb-5 group-hover:border-army-gold group-hover:shadow-gold-glow transition-all">
                    <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-serif font-bold text-army-gold mb-3 group-hover:text-army-gold-light transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-army-ivory/80 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom decorative bar */}
                <div className="mt-6 pt-4 border-t border-army-gold/15 flex items-center justify-between text-xs text-army-gold/70">
                  <span className="font-serif uppercase tracking-wider text-[11px]">Trụ cột 0{idx + 1}</span>
                  <span className="w-1.5 h-1.5 bg-army-gold rotate-45" />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default QuickIntro;
