/**
 * Quy chuẩn hệ thống 4 Giai đoạn lịch sử truyền thống Trường Sĩ quan Chính trị
 * Sắp xếp theo trình tự thời gian từ năm trước đến nay:
 * - Giai đoạn I (1951 – 1975): Thành lập & Kháng chiến giải phóng dân tộc
 * - Giai đoạn II (1976 – 1995): Thành lập Trường SQCT & Xây dựng chính quy tại Bắc Ninh
 * - Giai đoạn III (1995 – 2008): Hợp nhất & Kế thừa nhiệm vụ đào tạo
 * - Giai đoạn IV (2008 – Nay): Tái lập, Nâng cấp Trường Đại học Chính trị & Hiện đại hóa
 */

export const OFFICIAL_ERAS = [
  {
    id: 'giai-doan-1',
    name: 'Giai đoạn I',
    timeframe: '1951 – 1975',
    title: 'Thành lập & Kháng chiến giải phóng dân tộc',
    description:
      'Ngày 25/10/1951, Trường Chính trị Trung cấp Quân đội nhân dân Việt Nam được thành lập, đặt nền móng đào tạo cán bộ chính trị quân đội và chi viện đắc lực cho các chiến trường kháng chiến chống Pháp và chống Mỹ cứu nước.',
    quote: 'Mỗi cán bộ chính trị là một ngọn cờ dẫn dắt tinh thần bộ đội.',
    startYear: 1951,
    endYear: 1975,
    order: 1,
  },
  {
    id: 'giai-doan-2',
    name: 'Giai đoạn II',
    timeframe: '1976 – 1995',
    title: 'Thành lập Trường SQCT & Xây dựng chính quy',
    description:
      'Ngày 14/01/1976, Trường Sĩ quan Chính trị được thành lập, đóng quân tại Thành cổ Bắc Ninh; khẳng định vị thế trường Đảng tập trung trong Quân đội, đào tạo chính trị viên phân đội mẫu mực.',
    quote: 'Trung thành, kiên định, mẫu mực chính quy.',
    startYear: 1976,
    endYear: 1995,
    order: 2,
  },
  {
    id: 'giai-doan-3',
    name: 'Giai đoạn III',
    timeframe: '1995 – 2008',
    title: 'Hợp nhất & Kế thừa nhiệm vụ đào tạo',
    description:
      'Thời kỳ hợp nhất với Học viện Chính trị Quân sự, bộ phận Cơ sở II tiếp tục kiên trì thực hiện nhiệm vụ đào tạo sĩ quan chính trị cấp phân đội, giữ vững ngọn lửa nhiệt huyết và truyền thống vẻ vang.',
    quote: 'Kế thừa và phát huy truyền thống anh hùng.',
    startYear: 1995,
    endYear: 2008,
    order: 3,
  },
  {
    id: 'giai-doan-4',
    name: 'Giai đoạn IV',
    timeframe: '2008 – Nay',
    title: 'Tái lập, Nâng cấp Đại học & Phát triển hiện đại',
    description:
      'Tái lập Trường Sĩ quan Chính trị (2008), Thủ tướng Chính phủ quyết định thành lập Trường Đại học Chính trị (2010), xây dựng cơ sở Thạch Hòa – Hà Nội khang trang, chính quy, chuẩn hóa, hiện đại.',
    quote: 'Trung thành, sáng tạo, đoàn kết, vượt khó, dạy tốt, học tốt.',
    startYear: 2008,
    endYear: 9999,
    order: 4,
  },
];

/**
 * Lấy danh sách giai đoạn đã được điều chỉnh từ bộ lưu trữ (fallback OFFICIAL_ERAS)
 */
export function getSavedEras() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('sqct_eras_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((e) => ({
            ...e,
            id: e.slug || e.id || e._id,
            slug: e.slug || e.id || e._id,
          }));
        }
      }
    }
  } catch {
    // fallback to official eras
  }
  return OFFICIAL_ERAS.map((e) => ({
    ...e,
    id: e.slug || e.id,
    slug: e.slug || e.id,
  }));
}

/**
 * Tự động tìm giai đoạn phù hợp dựa theo số năm từ danh sách các giai đoạn điều chỉnh
 */
export function getEraByYear(year, erasList) {
  const list = erasList && erasList.length > 0 ? erasList : getSavedEras();
  const y = Number(year);
  if (!y || isNaN(y)) return list[0] || OFFICIAL_ERAS[0];

  const sorted = [...list].sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0) || (Number(a.startYear) || 0) - (Number(b.startYear) || 0)
  );

  // 1. Tìm các giai đoạn mà năm nằm trong khoảng [startYear, endYear]
  const matched = sorted.filter((e) => {
    const start = Number(e.startYear) || 0;
    const end = Number(e.endYear) || 9999;
    return y >= start && y <= end;
  });

  if (matched.length === 1) {
    return matched[0];
  } else if (matched.length > 1) {
    // Nếu có nhiều giai đoạn chồng lấn, ưu tiên giai đoạn có khoảng thời gian hẹp hơn (chính xác hơn)
    matched.sort((a, b) => {
      const spanA = (Number(a.endYear) || 9999) - (Number(a.startYear) || 0);
      const spanB = (Number(b.endYear) || 9999) - (Number(b.startYear) || 0);
      return spanA - spanB;
    });
    return matched[0];
  }

  // 2. Nếu năm trước cả giai đoạn đầu tiên -> trả về giai đoạn đầu tiên
  if (y < (Number(sorted[0]?.startYear) || 1951)) {
    return sorted[0];
  }

  // 3. Nếu năm sau giai đoạn cuối cùng -> trả về giai đoạn cuối cùng
  return sorted[sorted.length - 1] || list[0] || OFFICIAL_ERAS[0];
}

/**
 * Chuẩn hóa era ID từ bất kỳ chuỗi mô tả nào hoặc tự nhận diện theo năm từ các giai đoạn điều chỉnh
 */
export function normalizeEraId(eraString, year, erasList) {
  const list = erasList && erasList.length > 0 ? erasList : getSavedEras();

  if (eraString) {
    const s = String(eraString).toLowerCase().trim();

    // 1. Khớp chính xác theo id, slug hoặc _id
    const directMatch = list.find((e) => {
      const eId = String(e.id || '').toLowerCase();
      const eSlug = String(e.slug || '').toLowerCase();
      const eDbId = String(e._id || '').toLowerCase();
      return (eId && s === eId) || (eSlug && s === eSlug) || (eDbId && s === eDbId);
    });
    if (directMatch) return directMatch.slug || directMatch.id || directMatch._id;

    // 2. Khớp chính xác theo tên giai đoạn (VD: "giai đoạn i", "giai đoạn 1", "giai đoạn ii", ...)
    const nameMatch = list.find((e) => {
      const eraName = (e.name || '').toLowerCase().trim();
      return eraName && (s === eraName || s === eraName.replace(/\s+/g, ''));
    });
    if (nameMatch) return nameMatch.slug || nameMatch.id || nameMatch._id;
  }

  // 3. Khớp theo từ khóa lịch sử đặc thù của Nhà trường
  if (eraString) {
    const s = String(eraString).toLowerCase().trim();
    if (s.includes('kháng chiến') || s.includes('thành lập trường chính trị') || s.includes('trung cấp')) {
      return list[0]?.slug || list[0]?.id || 'giai-doan-1';
    }
    if (s.includes('bắc ninh') || s.includes('thành cổ') || s.includes('chính quy') || s.includes('sqct') || s.includes('xây dựng ban đầu') || s.includes('xây dựng và phát triển')) {
      return list[1]?.slug || list[1]?.id || 'giai-doan-2';
    }
    if (s.includes('hợp nhất') || s.includes('cơ sở ii') || s.includes('học viện chính trị quân sự')) {
      return list[2]?.slug || list[2]?.id || 'giai-doan-3';
    }
    if (s.includes('tái lập') || s.includes('tái thành lập') || s.includes('đại học chính trị') || s.includes('thạch hòa') || s.includes('anh hùng') || s.includes('đổi mới')) {
      return list[3]?.slug || list[3]?.id || 'giai-doan-4';
    }
  }

  // 4. Nếu có năm hợp lệ (>= 1900), năm là căn cứ xác định giai đoạn
  const y = Number(year);
  if (y && !isNaN(y) && y >= 1900) {
    const found = getEraByYear(y, list);
    if (found) return found.slug || found.id || found._id;
  }

  return list[0]?.slug || list[0]?.id || 'giai-doan-1';
}

/**
 * Lấy thứ tự của giai đoạn tự động theo trình tự thời gian (startYear từ nhỏ đến lớn)
 */
export function getEraOrder(eraString, year, erasList) {
  const list = erasList && erasList.length > 0 ? erasList : getSavedEras();
  // Sắp xếp các giai đoạn tự động theo năm bắt đầu
  const sorted = [...list].sort(
    (x, y) => (Number(x.startYear) || 0) - (Number(y.startYear) || 0) || (Number(x.order) || 0) - (Number(y.order) || 0)
  );
  const eraId = normalizeEraId(eraString, year, sorted);
  const index = sorted.findIndex(
    (e) => (e.slug || e.id || e._id) === eraId || e.id === eraId || e.slug === eraId
  );
  return index !== -1 ? index + 1 : 1;
}

/**
 * Hàm so sánh sắp xếp cột mốc thời gian chuẩn lịch sử:
 * 1. Tự động theo thứ tự giai đoạn (từ năm bắt đầu sớm nhất đến muộn nhất)
 * 2. Trong cùng giai đoạn, năm từ nhỏ đến lớn (từ năm trước đến nay, tăng dần)
 * 3. Ngày tháng cụ thể nếu có (tăng dần)
 * 4. Tiêu đề mốc lịch sử
 */
export function compareMilestonesChronological(a, b, erasList) {
  const list = erasList && erasList.length > 0 ? erasList : getSavedEras();

  // 1. Thứ tự giai đoạn
  const eraOrderA = getEraOrder(a.era, a.year, list);
  const eraOrderB = getEraOrder(b.era, b.year, list);
  if (eraOrderA !== eraOrderB) {
    return eraOrderA - eraOrderB;
  }

  // 2. Năm từ năm trước đến nay (tăng dần: 1951 -> 1976 -> 2024)
  const yearA = Number(a.year) || 0;
  const yearB = Number(b.year) || 0;
  if (yearA !== yearB) {
    return yearA - yearB;
  }

  // 3. Ngày tháng cụ thể trong năm (tăng dần)
  const timeA = a.date ? new Date(a.date).getTime() : 0;
  const timeB = b.date ? new Date(b.date).getTime() : 0;
  if (timeA && timeB && timeA !== timeB) {
    return timeA - timeB;
  }

  // 4. Tiêu đề
  return String(a.title || '').localeCompare(String(b.title || ''), 'vi');
}
