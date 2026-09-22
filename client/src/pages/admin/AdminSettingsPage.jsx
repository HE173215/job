import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../../components/admin/common/AdminPageHeader';
import siteSettingsService, { DEFAULT_SITE_SETTINGS } from '../../services/siteSettingsService';
import {
  Save,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Shield,
  FileText,
  AlertCircle,
} from 'lucide-react';

export function AdminSettingsPage() {
  const [formData, setFormData] = useState(DEFAULT_SITE_SETTINGS);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const current = siteSettingsService.getSettings();
    setFormData(current);
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      siteSettingsService.saveSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      setError(err.message || 'Không thể lưu cài đặt.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục toàn bộ thông tin chân trang về giá trị mặc định ban đầu?')) {
      siteSettingsService.resetSettings();
      setFormData(DEFAULT_SITE_SETTINGS);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Cài Đặt Hệ Thống & Ghi Chú Chân Trang"
        subtitle="Quản lý thông tin liên hệ, địa chỉ trụ sở, số máy trực ban và ghi chú bản quyền dưới cùng website"
        breadcrumb={[{ label: 'Cài đặt & Ghi chú chân trang' }]}
        action={
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-serif font-bold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Xem website thực tế</span>
          </a>
        }
      />

      {saveSuccess && (
        <div className="p-4 rounded-military bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center justify-between shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">
              Đã lưu thành công! Toàn bộ ghi chú và thông tin chân trang trên website đã được cập nhật ngay lập tức.
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-military bg-red-50 border border-red-300 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Thông tin liên hệ */}
        <div className="p-6 bg-white rounded-military border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <MapPin className="w-4 h-4 text-[#D99C2B]" />
            <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#410202]">
              Thông tin liên hệ & Địa chỉ trụ sở
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                Địa chỉ trụ sở chính <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="VD: Xã Thạch Hòa, Huyện Thạch Thất, TP. Hà Nội"
                  className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Hiển thị tại mục "Thông tin liên hệ" ở chân trang
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Trực ban tác chiến / Đường dây nóng <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.hotline}
                    onChange={(e) => handleChange('hotline', e.target.value)}
                    placeholder="VD: 024.3368.xxxx (Trực ban tác chiến)"
                    className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Thư điện tử (Email) <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="VD: congthongtin@daihocchinhtri.edu.vn"
                    className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Ghi chú quy chuẩn & Bản quyền dưới cùng trang web */}
        <div className="p-6 bg-white rounded-military border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <FileText className="w-4 h-4 text-[#D99C2B]" />
            <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#410202]">
              Ghi chú chân trang & Bản quyền dưới cùng website
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                Ghi chú bản quyền (Copyright)
              </label>
              <input
                type="text"
                value={formData.copyright}
                onChange={(e) => handleChange('copyright', e.target.value)}
                placeholder="VD: Bản quyền thuộc Trường Sĩ quan Chính trị – Bộ Quốc phòng."
                className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Tự động nối tiếp sau năm hiện tại (Ví dụ: © 2026 [Nội dung])
              </span>
            </div>

            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                Ghi chú trích dẫn nguồn phát hành lại
              </label>
              <input
                type="text"
                value={formData.citationNote}
                onChange={(e) => handleChange('citationNote', e.target.value)}
                placeholder="VD: Ghi rõ nguồn 'Cổng Thông tin điện tử Trường Sĩ quan Chính trị' khi phát hành lại thông tin."
                className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                Khẩu hiệu / Phương châm danh dự (Slogan góc phải chân trang)
              </label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => handleChange('slogan', e.target.value)}
                placeholder="VD: Kỷ luật – Danh dự – Trách nhiệm"
                className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none font-serif text-[#410202] font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                Ghi chú quy chuẩn / Bảo mật quân sự
              </label>
              <textarea
                rows="2"
                value={formData.securityNote}
                onChange={(e) => handleChange('securityNote', e.target.value)}
                placeholder="Nhập ghi chú quy chuẩn hiển thị ở cuối chân trang..."
                className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Thông tin giới thiệu ngắn ở Chân trang */}
        <div className="p-6 bg-white rounded-military border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Shield className="w-4 h-4 text-[#D99C2B]" />
            <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#410202]">
              Giới thiệu vắn tắt & Khẩu hiệu tổ chức
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Tên cơ quan cấp trên
                </label>
                <input
                  type="text"
                  value={formData.subOrgName}
                  onChange={(e) => handleChange('subOrgName', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Tên Nhà trường
                </label>
                <input
                  type="text"
                  value={formData.orgName}
                  onChange={(e) => handleChange('orgName', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                Huy hiệu / Khẩu hiệu hành động
              </label>
              <input
                type="text"
                value={formData.motto}
                onChange={(e) => handleChange('motto', e.target.value)}
                placeholder="VD: Chính quy – Chuẩn hóa – Hiện đại"
                className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
                Đoạn giới thiệu vắn tắt về nhà trường
              </label>
              <textarea
                rows="3"
                value={formData.introSummary}
                onChange={(e) => handleChange('introSummary', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex items-center justify-between p-4 bg-stone-100 rounded-military border border-stone-200">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-serif font-bold text-stone-600 hover:text-red-700 hover:bg-stone-200 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-xs font-serif font-bold bg-[#D99C2B] text-[#410202] hover:bg-[#D99C2B]/90 rounded shadow-sm transition-all flex items-center gap-2 cursor-pointer font-extrabold tracking-wider uppercase"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Đang lưu...' : 'Lưu Thay Đổi Chân Trang'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminSettingsPage;
