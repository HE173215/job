import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/layout/AdminSidebar';
import AdminHeader from '../components/admin/layout/AdminHeader';
import AdminMobileMenu from '../components/admin/layout/AdminMobileMenu';

export function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Xác định tiêu đề trang dựa trên pathname
  const getPageTitle = (pathname) => {
    if (pathname === '/admin') return 'Tổng Quan Bảng Điều Khiển';
    if (pathname.startsWith('/admin/history')) return 'Quản Lý Lịch Sử Truyền Thống';
    if (pathname.startsWith('/admin/news')) return 'Quản Lý Tin Tức & Bài Viết';
    if (pathname.startsWith('/admin/activities')) return 'Quản Lý Hoạt Động';
    if (pathname.startsWith('/admin/gallery')) return 'Quản Lý Thư Viện Ảnh';
    return 'Hệ Thống Quản Trị CMS';
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#241A18] flex">
      {/* Desktop Sidebar (Fixed/Sticky) */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar className="h-screen sticky top-0" />
      </div>

      {/* Mobile Drawer */}
      <AdminMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <AdminHeader
          pageTitle={pageTitle}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
