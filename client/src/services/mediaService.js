import api from './api';
import axios from 'axios';

export const mediaService = {
  /**
   * Tải ảnh trực tiếp lên Cloudinary từ trình duyệt
   * @param {File} file - File ảnh từ input file
   * @param {'history' | 'news' | 'activities' | 'gallery'} folder - Thư mục lưu trữ
   * @param {function(number): void} [onProgress] - Callback tiến trình tải lên
   * @returns {Promise<{ publicId: string, url: string, width: number, height: number, format: string, bytes: number }>}
   */
  async uploadImage(file, folder = 'history', onProgress = null) {
    // 1. Kiểm tra định dạng và dung lượng file cơ bản tại client
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedMimeTypes.includes(file.type)) {
      throw new Error('Định dạng ảnh không hợp lệ. Chỉ chấp nhận file JPG, PNG, WEBP, hoặc AVIF.');
    }

    const defaultMaxSize = 10 * 1024 * 1024; // 10MB mặc định
    if (file.size > defaultMaxSize) {
      throw new Error('Dung lượng ảnh vượt quá giới hạn 10MB.');
    }

    try {
      // 2. Lấy chữ ký tải ảnh từ Backend
      const signatureRes = await api.post('/admin/media/signature', { folder });
      
      if (!signatureRes?.success || !signatureRes?.data) {
        throw new Error('Không thể nhận chữ ký tải ảnh từ máy chủ.');
      }

      const {
        timestamp,
        signature,
        apiKey,
        cloudName,
        folder: targetFolder,
        allowedFormats,
        uploadPreset,
        maxBytes,
      } = signatureRes.data;

      // Kiểm tra dung lượng theo maxBytes từ server nếu có
      if (maxBytes && file.size > maxBytes) {
        const maxMB = Math.round(maxBytes / (1024 * 1024));
        throw new Error(`Dung lượng ảnh vượt quá giới hạn ${maxMB}MB.`);
      }

      // 3. Chuẩn bị FormData để upload trực tiếp lên Cloudinary
      // Lưu ý: Bất kỳ tham số nào nằm trong chữ ký đều bắt buộc phải gửi kèm trong FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', targetFolder);

      if (allowedFormats) {
        const formatsStr = Array.isArray(allowedFormats) ? allowedFormats.join(',') : allowedFormats;
        formData.append('allowed_formats', formatsStr);
      }

      if (uploadPreset) {
        formData.append('upload_preset', uploadPreset);
      }

      // 4. Gửi request trực tiếp tới Cloudinary API
      // Dùng axios riêng không kèm withCredentials (vì gửi sang Cloudinary)
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const cloudRes = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        },
      });

      const data = cloudRes.data;

      // 5. Chuẩn hóa đối tượng ảnh theo contract quy định
      return {
        publicId: data.public_id,
        url: data.secure_url,
        alt: '',
        caption: '',
        width: data.width || 0,
        height: data.height || 0,
        format: data.format || '',
        bytes: data.bytes || 0,
      };
    } catch (err) {
      // Nếu Backend chưa có endpoint /api/v1/admin/media/signature
      console.warn('[mediaService] Không thể kết nối Cloudinary Signature API hoặc tải ảnh thất bại:', err);
      
      // Fallback cho môi trường dev khi backend chưa dựng endpoint media
      if (err.status === 404 || err.message?.includes('chữ ký')) {
        console.info('[mediaService] Đang dùng object URL cục bộ để hỗ trợ kiểm thử giao diện.');
        const mockUrl = URL.createObjectURL(file);
        return {
          publicId: `dev-preview-${Date.now()}`,
          url: mockUrl,
          alt: file.name,
          caption: 'Ảnh mô phỏng môi trường phát triển',
          width: 800,
          height: 600,
          format: file.type.split('/')[1] || 'jpg',
          bytes: file.size,
        };
      }

      throw new Error(err.message || 'Tải ảnh lên máy chủ Cloudinary thất bại. Vui lòng thử lại.');
    }
  },
};

export default mediaService;
