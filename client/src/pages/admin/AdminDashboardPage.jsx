import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Newspaper, CalendarDays, Image as ImageIcon, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import adminMilestoneService from '../../services/adminMilestoneService';
import adminNewsService from '../../services/adminNewsService';
import adminActivityService from '../../services/adminActivityService';
import adminGalleryService from '../../services/adminGalleryService';

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    milestones: null,
    news: null,
    activities: null,
    albums: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      try {
        const [mRes, nRes, aRes, gRes] = await Promise.allSettled([
          adminMilestoneService.getList({ limit: 1 }),
          adminNewsService.getList({ limit: 1 }),
          adminActivityService.getList({ limit: 1 }),
          adminGalleryService.getList({ limit: 1 }),
        ]);

        if (!mounted) return;

        setStats({
          milestones: mRes.status === 'fulfilled' ? mRes.value.pagination?.total ?? mRes.value.data?.length : '--',
          news: nRes.status === 'fulfilled' ? nRes.value.pagination?.total ?? nRes.value.data?.length : '--',
          activities: aRes.status === 'fulfilled' ? aRes.value.pagination?.total ?? aRes.value.data?.length : '--',
          albums: gRes.status === 'fulfilled' ? gRes.value.pagination?.total ?? gRes.value.data?.length : '--',
        });
      } catch (err) {
        console.warn('Lỗi khi tải thống kê dashboard:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadStats();
    return () => {
      mounted = false;
    };
  }, []);

  const statCards = [
    {
      title: 'Lịch sử truyền thống',
      count: loading ? '--' : stats.milestones,
      desc: 'Cột mốc & tư liệu lịch sử',
      icon: Clock,
      to: '/admin/history',
      createTo: '/admin/history/create',
      createLabel: 'Thêm cột mốc',
      color: 'border-l-amber-600',
    },
    {
      title: 'Tin tức & Bài viết',
      count: loading ? '--' : stats.news,
      desc: 'Bản tin giáo dục đào tạo',
      icon: Newspaper,
      to: '/admin/news',
      createTo: '/admin/news/create',
      createLabel: 'Thêm tin mới',
      color: 'border-l-red-800',
    },
    {
      title: 'Hoạt động nổi bật',
      count: loading ? '--' : stats.activities,
      desc: 'Sự kiện, phong trào thi đua',
      icon: CalendarDays,
      to: '/admin/activities',
      createTo: '/admin/activities/create',
      createLabel: 'Thêm hoạt động',
      color: 'border-l-amber-700',
    },
    {
      title: 'Thư viện ảnh',
      count: loading ? '--' : stats.albums,
      desc: 'Album tư liệu truyền thống',
      icon: ImageIcon,
      to: '/admin/gallery',
      createTo: '/admin/gallery/create',
      createLabel: 'Thêm album',
      color: 'border-l-yellow-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-military bg-gradient-to-r from-[#410202] to-[#730203] text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#D99C2B] font-serif uppercase tracking-widest font-bold">
            BỘ QUỐC PHÒNG • TRƯỜNG SĨ QUAN CHÍNH TRỊ
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-[#F8F4EA] mt-1">
            BẢNG ĐIỀU KHIỂN HỆ THỐNG QUẢN TRỊ
          </h2>
          <p className="text-xs text-[#E0DACD]/80 mt-1 max-w-xl">
            Quản lý nội dung cổng thông tin điện tử, lịch sử truyền thống, tin tức giáo dục đào tạo và tư liệu ảnh lưu trữ.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-black/20 p-2.5 rounded border border-[#D99C2B]/30 text-xs text-[#D99C2B]">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-serif">Hệ thống sẵn sàng</span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-military bg-white border border-stone-200 shadow-xs border-l-4 ${card.color} flex flex-col justify-between hover:shadow-md transition-shadow`}
            >
              <div>
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-serif font-bold uppercase tracking-wider text-stone-600">
                    {card.title}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-[#410202]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-3xl font-serif font-extrabold text-[#241A18] my-1">
                  {card.count ?? '--'}
                </div>
                <p className="text-[11px] text-stone-500">{card.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <Link
                  to={card.to}
                  className="font-serif font-bold text-[#410202] hover:text-[#D99C2B] flex items-center gap-1 transition-colors"
                >
                  <span>Quản lý</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to={card.createTo}
                  className="px-2 py-0.5 rounded text-[11px] bg-stone-100 hover:bg-[#D99C2B] hover:text-[#410202] text-stone-700 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>{card.createLabel}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Links */}
      <div className="p-6 bg-white rounded-military border border-stone-200 shadow-xs">
        <h3 className="text-sm font-serif font-bold uppercase tracking-wider text-[#410202] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D99C2B]" />
          Lối tắt thao tác nhanh
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            to="/admin/history/create"
            className="p-3 rounded border border-dashed border-stone-300 hover:border-[#D99C2B] hover:bg-stone-50 text-xs font-serif font-semibold text-[#241A18] flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 text-[#410202]" />
            <span>Thêm mốc lịch sử mới</span>
          </Link>

          <Link
            to="/admin/news/create"
            className="p-3 rounded border border-dashed border-stone-300 hover:border-[#D99C2B] hover:bg-stone-50 text-xs font-serif font-semibold text-[#241A18] flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 text-[#410202]" />
            <span>Đăng bài tin tức mới</span>
          </Link>

          <Link
            to="/admin/activities/create"
            className="p-3 rounded border border-dashed border-stone-300 hover:border-[#D99C2B] hover:bg-stone-50 text-xs font-serif font-semibold text-[#241A18] flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 text-[#410202]" />
            <span>Tạo hoạt động mới</span>
          </Link>

          <Link
            to="/admin/gallery/create"
            className="p-3 rounded border border-dashed border-stone-300 hover:border-[#D99C2B] hover:bg-stone-50 text-xs font-serif font-semibold text-[#241A18] flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 text-[#410202]" />
            <span>Thêm album ảnh mới</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
