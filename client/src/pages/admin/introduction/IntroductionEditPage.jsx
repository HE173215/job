import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, ExternalLink, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import AdminErrorState from '../../../components/admin/common/AdminErrorState';
import AdminLoading from '../../../components/admin/common/AdminLoading';
import AdminPageHeader from '../../../components/admin/common/AdminPageHeader';
import introductionService from '../../../services/introductionService';

const EMPTY_CONTENT = {
  badge: '',
  title: '',
  subtitle: '',
  functionTitle: '',
  functionParagraphs: [''],
  trainingTitle: '',
  trainingParagraphs: [''],
  notice: '',
};

function ParagraphEditor({ label, paragraphs, onChange }) {
  const updateParagraph = (index, value) => {
    onChange(paragraphs.map((paragraph, currentIndex) => (
      currentIndex === index ? value : paragraph
    )));
  };

  const removeParagraph = (index) => {
    if (paragraphs.length === 1) return;
    onChange(paragraphs.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700">
          {label} <span className="text-red-600">*</span>
        </label>
        <button
          type="button"
          disabled={paragraphs.length >= 10}
          onClick={() => onChange([...paragraphs, ''])}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#410202] hover:text-red-800 disabled:opacity-40"
        >
          <Plus className="w-3.5 h-3.5" />
          Thêm đoạn
        </button>
      </div>

      {paragraphs.map((paragraph, index) => (
        <div key={index} className="flex items-start gap-2">
          <textarea
            required
            rows="4"
            maxLength={5000}
            value={paragraph}
            onChange={(event) => updateParagraph(index, event.target.value)}
            placeholder={`Đoạn nội dung ${index + 1}`}
            className="flex-1 px-3 py-2 text-sm rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
          />
          <button
            type="button"
            aria-label={`Xóa đoạn ${index + 1}`}
            title="Xóa đoạn"
            disabled={paragraphs.length === 1}
            onClick={() => removeParagraph(index)}
            className="p-2 text-stone-400 hover:text-red-700 disabled:opacity-30"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function IntroductionEditPage() {
  const [formData, setFormData] = useState(EMPTY_CONTENT);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setLoadError('');

    introductionService.getAdmin()
      .then((data) => {
        if (mounted && data) setFormData({ ...EMPTY_CONTENT, ...data });
      })
      .catch((error) => {
        if (mounted) setLoadError(error.message || 'Không thể tải nội dung giới thiệu.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [reloadKey]);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setSaveError('');

    try {
      const data = await introductionService.update(formData);
      if (data) setFormData({ ...EMPTY_CONTENT, ...data });
      setSaved(true);
    } catch (error) {
      setSaveError(error.message || 'Không thể lưu nội dung giới thiệu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoading text="Đang tải nội dung giới thiệu..." />;
  if (loadError) {
    return <AdminErrorState message={loadError} onRetry={() => setReloadKey((value) => value + 1)} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Chỉnh Sửa Trang Giới Thiệu"
        subtitle="Quản lý toàn bộ tiêu đề, nội dung chức năng, mục tiêu đào tạo và ghi chú công khai"
        breadcrumb={[{ label: 'Trang giới thiệu' }]}
        action={(
          <a
            href="/introduction"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-serif font-bold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Xem trang công khai
          </a>
        )}
      />

      {saved && (
        <div role="status" className="p-4 rounded-military bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          Nội dung giới thiệu đã được lưu và cập nhật trên trang công khai.
        </div>
      )}

      {saveError && (
        <div role="alert" className="p-4 rounded-military bg-red-50 border border-red-300 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {saveError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="p-6 bg-white rounded-military border border-stone-200 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-sm uppercase tracking-wider text-[#410202] border-b border-stone-100 pb-3">
            Tiêu đề trang
          </h2>

          <div>
            <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
              Nhãn phía trên <span className="text-red-600">*</span>
            </label>
            <input
              required
              maxLength={100}
              value={formData.badge}
              onChange={(event) => updateField('badge', event.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
              Tiêu đề chính <span className="text-red-600">*</span>
            </label>
            <input
              required
              maxLength={300}
              value={formData.title}
              onChange={(event) => updateField('title', event.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
              Mô tả ngắn <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              rows="3"
              maxLength={1000}
              value={formData.subtitle}
              onChange={(event) => updateField('subtitle', event.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
            />
          </div>
        </section>

        <section className="p-6 bg-white rounded-military border border-stone-200 shadow-xs space-y-5">
          <h2 className="font-serif font-bold text-sm uppercase tracking-wider text-[#410202] border-b border-stone-100 pb-3">
            Chức năng và nhiệm vụ
          </h2>
          <div>
            <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
              Tiêu đề khối <span className="text-red-600">*</span>
            </label>
            <input
              required
              maxLength={200}
              value={formData.functionTitle}
              onChange={(event) => updateField('functionTitle', event.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
            />
          </div>
          <ParagraphEditor
            label="Các đoạn nội dung"
            paragraphs={formData.functionParagraphs}
            onChange={(value) => updateField('functionParagraphs', value)}
          />
        </section>

        <section className="p-6 bg-white rounded-military border border-stone-200 shadow-xs space-y-5">
          <h2 className="font-serif font-bold text-sm uppercase tracking-wider text-[#410202] border-b border-stone-100 pb-3">
            Mục tiêu đào tạo
          </h2>
          <div>
            <label className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700 mb-1">
              Tiêu đề khối <span className="text-red-600">*</span>
            </label>
            <input
              required
              maxLength={200}
              value={formData.trainingTitle}
              onChange={(event) => updateField('trainingTitle', event.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
            />
          </div>
          <ParagraphEditor
            label="Các đoạn nội dung"
            paragraphs={formData.trainingParagraphs}
            onChange={(value) => updateField('trainingParagraphs', value)}
          />
        </section>

        <section className="p-6 bg-white rounded-military border border-stone-200 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-sm uppercase tracking-wider text-[#410202] border-b border-stone-100 pb-3">
            Ghi chú cuối trang
          </h2>
          <textarea
            required
            rows="4"
            maxLength={2000}
            value={formData.notice}
            onChange={(event) => updateField('notice', event.target.value)}
            className="w-full px-3 py-2 text-sm rounded border border-stone-200 focus:border-[#D99C2B] focus:outline-none"
          />
        </section>

        <div className="flex justify-end p-4 bg-stone-100 rounded-military border border-stone-200">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-serif font-extrabold uppercase tracking-wider bg-[#D99C2B] text-[#410202] hover:bg-[#D99C2B]/90 rounded shadow-sm disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Đang lưu...' : 'Lưu nội dung giới thiệu'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default IntroductionEditPage;
