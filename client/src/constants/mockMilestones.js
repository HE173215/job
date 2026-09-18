// Dữ liệu mẫu quy chuẩn theo quy tắc AGENT.md & ANTIGRAVITI.md:
// "TUYỆT ĐỐI KHÔNG tự viết sự kiện lịch sử thật. Dùng placeholder mẫu rõ ràng khi API chưa có dữ liệu."

const createArchivalPlaceholderSvg = (title, year) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#290102"/>
        <stop offset="50%" stop-color="#410202"/>
        <stop offset="100%" stop-color="#130102"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#D99C2B" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#D99C2B" stop-opacity="0"/>
      </radialGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D99C2B" stroke-width="0.5" stroke-opacity="0.1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <rect width="100%" height="100%" fill="url(#glow)"/>
    
    <!-- Border Frame -->
    <rect x="20" y="20" width="760" height="460" fill="none" stroke="#D99C2B" stroke-width="1.5" stroke-opacity="0.4"/>
    <rect x="28" y="28" width="744" height="444" fill="none" stroke="#D99C2B" stroke-width="0.8" stroke-opacity="0.2"/>
    
    <!-- Military Emblem Star -->
    <polygon points="400,160 415,205 460,205 425,232 438,275 400,248 362,275 375,232 340,205 385,205" fill="#D99C2B" opacity="0.85"/>
    <circle cx="400" cy="225" r="70" fill="none" stroke="#D99C2B" stroke-width="1" stroke-opacity="0.3"/>
    
    <!-- Labels -->
    <text x="400" y="325" font-family="'Be Vietnam Pro', sans-serif" font-size="20" font-weight="bold" fill="#D99C2B" text-anchor="middle" letter-spacing="2">TƯ LIỆU LỊCH SỬ - NĂM ${year}</text>
    <text x="400" y="358" font-family="'Be Vietnam Pro', sans-serif" font-size="14" fill="#E0DACD" text-anchor="middle" opacity="0.8">${title}</text>
    <text x="400" y="385" font-family="'Be Vietnam Pro', sans-serif" font-size="11" fill="#B7AAA2" text-anchor="middle" opacity="0.6">[Tư liệu lưu trữ mẫu - Đang cập nhật hình ảnh chính thức]</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const MOCK_ERAS = [
  {
    id: "giai-doan-1",
    name: "Giai đoạn I",
    timeframe: "19XX – 19XX",
    title: "Giai đoạn Thành lập & Kháng chiến [Dữ liệu mẫu]",
    description: "Thời kỳ mở đầu trang sử vẻ vang, đặt nền móng công tác tư tưởng và đào tạo cán bộ chính trị quân đội nhân dân.",
    quote: "Giữ vững định hướng chính trị trong mọi thử thách cam go.",
  },
  {
    id: "giai-doan-2",
    name: "Giai đoạn II",
    timeframe: "19XX – 19XX",
    title: "Kháng chiến & Thống nhất đất nước [Dữ liệu mẫu]",
    description: "Chi viện chiến trường, bồi dưỡng hàng vạn cán bộ chính trị đáp ứng yêu cầu giải phóng miền Nam thống nhất non sông.",
    quote: "Mỗi cán bộ chính trị là một ngọn cờ dẫn dắt tinh thần bộ đội.",
  },
  {
    id: "giai-doan-3",
    name: "Giai đoạn III",
    timeframe: "19XX – 20XX",
    title: "Xây dựng hòa bình & Đổi mới [Dữ liệu mẫu]",
    description: "Chuyển mình mạnh mẽ trong sự nghiệp xây dựng quân đội chính quy, hiện đại hóa giáo trình đào tạo và nghiên cứu khoa học lý luận.",
    quote: "Đổi mới tư duy, nâng cao chất lượng đào tạo vì Tổ quốc.",
  },
  {
    id: "giai-doan-4",
    name: "Giai đoạn IV",
    timeframe: "20XX – Nay",
    title: "Hội nhập & Phát triển vững chắc [Dữ liệu mẫu]",
    description: "Nhà trường mẫu mực, chuẩn mực, đào tạo đội ngũ cán bộ chính trị tinh nhuệ, trung thành tuyệt đối với Đảng và Tổ quốc.",
    quote: "Trung thành vô hạn, dạy tốt học tốt, mẫu mực chính quy.",
  },
];

export const MOCK_MILESTONES = [
  {
    _id: "m-01",
    year: "19XX",
    date: "19XX-01-01",
    title: "Mốc lịch sử mẫu 01: Thành lập cơ sở đào tạo [Đang cập nhật]",
    slug: "moc-lich-su-mau-01",
    era: "giai-doan-1",
    eraLabel: "Giai đoạn I (19XX – 19XX)",
    summary: "Nội dung tóm tắt mốc son mở đầu - Dữ liệu đang được cập nhật chính thức từ cổng lưu trữ văn thư quân đội.",
    content: "Chi tiết sự kiện mốc son số 01 đang chờ phê duyệt dữ liệu chính thức. Nhà trường vinh dự đón nhận nhiệm vụ trọng đại trong công tác giáo dục và đào tạo cán bộ chính trị.",
    coverImage: {
      url: createArchivalPlaceholderSvg("Thành lập cơ sở đào tạo mẫu", "19XX"),
      alt: "Ảnh tư liệu mốc son thành lập cơ sở đào tạo mẫu năm 19XX",
      caption: "Tư liệu lưu trữ: Quyết định thành lập cơ sở đào tạo mẫu (19XX)",
    },
    order: 1,
    featured: true,
    published: true,
  },
  {
    _id: "m-02",
    year: "19XX",
    date: "19XX-06-15",
    title: "Mốc lịch sử mẫu 02: Khóa đào tạo cán bộ đầu tiên [Đang cập nhật]",
    slug: "moc-lich-su-mau-02",
    era: "giai-doan-1",
    eraLabel: "Giai đoạn I (19XX – 19XX)",
    summary: "Khai giảng khóa đào tạo cán bộ chính trị đầu tiên phục vụ chiến dịch - Dữ liệu mẫu đang cập nhật.",
    content: "Nội dung mẫu về các thế hệ học viên đầu tiên tốt nghiệp và lên đường thực hiện nhiệm vụ vẻ vang tại các chiến trường trọng điểm.",
    coverImage: {
      url: createArchivalPlaceholderSvg("Khóa đào tạo cán bộ đầu tiên", "19XX"),
      alt: "Ảnh tư liệu khóa đào tạo cán bộ đầu tiên",
      caption: "Lễ xuất quân của học viên khóa I [Ảnh tư liệu mẫu]",
    },
    order: 2,
    featured: true,
    published: true,
  },
  {
    _id: "m-03",
    year: "19XX",
    date: "19XX-04-30",
    title: "Mốc lịch sử mẫu 03: Chi viện toàn diện tiền tuyến [Đang cập nhật]",
    slug: "moc-lich-su-mau-03",
    era: "giai-doan-2",
    eraLabel: "Giai đoạn II (19XX – 19XX)",
    summary: "Đóng góp to lớn sức người, sức của và nguồn cán bộ chính trị dày dạn cho các chiến dịch lớn.",
    content: "Tư liệu mẫu ghi nhận sự đóng góp của cán bộ, giảng viên và học viên tham gia trực tiếp trên các hướng chiến dịch trọng yếu.",
    coverImage: {
      url: createArchivalPlaceholderSvg("Chi viện tiền tuyến mẫu", "19XX"),
      alt: "Ảnh tư liệu chi viện tiền tuyến mẫu",
      caption: "Đoàn cán bộ lên đường chi viện chiến trường [Tư liệu mẫu]",
    },
    order: 3,
    featured: true,
    published: true,
  },
  {
    _id: "m-04",
    year: "19XX",
    date: "19XX-09-02",
    title: "Mốc lịch sử mẫu 04: Củng cố tổ chức sau ngày thống nhất [Đang cập nhật]",
    slug: "moc-lich-su-mau-04",
    era: "giai-doan-2",
    eraLabel: "Giai đoạn II (19XX – 19XX)",
    summary: "Xây dựng cơ sở mới, hoàn thiện hệ thống giáo trình đáp ứng thời kỳ kiến thiết non sông.",
    content: "Giai đoạn củng cố toàn diện bộ máy quản lý, xây dựng cơ sở hạ tầng doanh trại chính quy và chuẩn hóa đội ngũ giảng viên sư phạm quân sự.",
    coverImage: {
      url: createArchivalPlaceholderSvg("Củng cố tổ chức sau thống nhất", "19XX"),
      alt: "Ảnh tư liệu củng cố tổ chức sau ngày thống nhất",
      caption: "Hội nghị tổng kết công tác giảng dạy giai đoạn hòa bình [Tư liệu mẫu]",
    },
    order: 4,
    featured: false,
    published: true,
  },
  {
    _id: "m-05",
    year: "19XX",
    date: "19XX-12-22",
    title: "Mốc lịch sử mẫu 05: Đổi mới phương pháp sư phạm [Đang cập nhật]",
    slug: "moc-lich-su-mau-05",
    era: "giai-doan-3",
    eraLabel: "Giai đoạn III (19XX – 20XX)",
    summary: "Đột phá trong nghiên cứu lý luận chính trị và ứng dụng khoa học vào quản lý giáo dục quân sự.",
    content: "Nội dung mẫu về công cuộc đổi mới chương trình khung đào tạo bậc đại học và sau đại học cho sĩ quan chính trị cấp phân đội và chiến dịch.",
    coverImage: {
      url: createArchivalPlaceholderSvg("Đổi mới phương pháp sư phạm", "19XX"),
      alt: "Ảnh tư liệu đổi mới phương pháp giảng dạy",
      caption: "Giảng đường chính quy trong thời kỳ đổi mới [Tư liệu mẫu]",
    },
    order: 5,
    featured: true,
    published: true,
  },
  {
    _id: "m-06",
    year: "20XX",
    date: "20XX-05-19",
    title: "Mốc lịch sử mẫu 06: Nâng cấp vị thế học viện đại học [Đang cập nhật]",
    slug: "moc-lich-su-mau-06",
    era: "giai-doan-3",
    eraLabel: "Giai đoạn III (19XX – 20XX)",
    summary: "Khẳng định uy tín trung tâm hàng đầu về đào tạo cán bộ chính trị toàn quân.",
    content: "Được Đảng, Nhà nước và Quân ủy Trung ương ghi nhận bằng các danh hiệu thi đua cao quý qua từng chặng đường xây dựng và phát triển.",
    coverImage: {
      url: createArchivalPlaceholderSvg("Nâng cấp vị thế học viện", "20XX"),
      alt: "Ảnh tư liệu nâng cấp vị thế học viện đại học",
      caption: "Lễ đón nhận quyết định nâng cấp học viện [Tư liệu mẫu]",
    },
    order: 6,
    featured: false,
    published: true,
  },
  {
    _id: "m-07",
    year: "20XX",
    date: "20XX-10-10",
    title: "Mốc lịch sử mẫu 07: Hiện đại hóa giảng đường thông minh [Đang cập nhật]",
    slug: "moc-lich-su-mau-07",
    era: "giai-doan-4",
    eraLabel: "Giai đoạn IV (20XX – Nay)",
    summary: "Ứng dụng chuyển đổi số và trung tâm mô phỏng diễn tập chỉ huy công tác đảng, công tác chính trị.",
    content: "Xây dựng nhà trường thông minh tiếp cận công nghệ giáo dục 4.0, đáp ứng mục tiêu xây dựng Quân đội tinh, gọn, mạnh, tiến lên hiện đại.",
    coverImage: {
      url: createArchivalPlaceholderSvg("Hiện đại hóa giảng đường thông minh", "20XX"),
      alt: "Ảnh tư liệu hiện đại hóa giảng đường thông minh",
      caption: "Phòng học trực tuyến và trung tâm mô phỏng diễn tập [Tư liệu mẫu]",
    },
    order: 7,
    featured: true,
    published: true,
  },
  {
    _id: "m-08",
    year: "20XX",
    date: "20XX-12-22",
    title: "Mốc lịch sử mẫu 08: Vững bước trong kỷ nguyên mới [Đang cập nhật]",
    slug: "moc-lich-su-mau-08",
    era: "giai-doan-4",
    eraLabel: "Giai đoạn IV (20XX – Nay)",
    summary: "Kiên định mục tiêu đào tạo đội ngũ cán bộ chính trị vừa hồng vừa chuyên, phụng sự Tổ quốc.",
    content: "Tiếp tục phát huy truyền thống anh hùng, nỗ lực phấn đấu lập nhiều chiến công mới trong sự nghiệp bảo vệ vững chắc Tổ quốc Việt Nam xã hội chủ nghĩa.",
    coverImage: {
      url: createArchivalPlaceholderSvg("Vững bước trong kỷ nguyên mới", "20XX"),
      alt: "Ảnh tư liệu kỷ nguyên mới",
      caption: "Đội ngũ cán bộ giảng viên tự hào tiếp bước truyền thống vẻ vang [Tư liệu mẫu]",
    },
    order: 8,
    featured: true,
    published: true,
  },
];

export const MOCK_GALLERY = [
  {
    id: "g-01",
    year: "19XX",
    title: "Lễ duyệt binh truyền thống mẫu [Tư liệu]",
    caption: "Học viên Trường Sĩ quan Chính trị trong đội hình duyệt binh trang nghiêm [Dữ liệu mẫu]",
    source: "Phòng Lưu trữ Tư liệu",
    url: createArchivalPlaceholderSvg("Lễ duyệt binh truyền thống mẫu", "19XX"),
    category: "nghi-le",
  },
  {
    id: "g-02",
    year: "19XX",
    title: "Giờ học chính trị trên thao trường [Tư liệu]",
    caption: "Rèn luyện bản lĩnh chính trị kết hợp thực hành huấn luyện dã ngoại [Dữ liệu mẫu]",
    source: "Tư liệu Khoa Khoa học Xã hội",
    url: createArchivalPlaceholderSvg("Giờ học chính trị trên thao trường", "19XX"),
    category: "dao-tao",
  },
  {
    id: "g-03",
    year: "20XX",
    title: "Hội thảo khoa học toàn quân mẫu [Tư liệu]",
    caption: "Cán bộ nghiên cứu lý luận báo cáo tham luận khoa học [Dữ liệu mẫu]",
    source: "Phòng Khoa học Quân sự",
    url: createArchivalPlaceholderSvg("Hội thảo khoa học toàn quân mẫu", "20XX"),
    category: "nghien-cuu",
  },
  {
    id: "g-04",
    year: "20XX",
    title: "Diễn tập công tác đảng, công tác chính trị [Tư liệu]",
    caption: "Thực hành phương án diễn tập chỉ huy tham mưu trong tình huống chiến đấu giả định [Dữ liệu mẫu]",
    source: "Phòng Đào tạo",
    url: createArchivalPlaceholderSvg("Diễn tập CTĐ, CTCT mẫu", "20XX"),
    category: "dien-tap",
  },
  {
    id: "g-05",
    year: "20XX",
    title: "Hoạt động hành quân dã ngoại dân vận [Tư liệu]",
    caption: "Bộ đội về bản giúp nhân dân thu hoạch mùa màng, thắt chặt tình đoàn kết quân dân [Dữ liệu mẫu]",
    source: "Ban Thanh niên",
    url: createArchivalPlaceholderSvg("Hành quân dã ngoại dân vận", "20XX"),
    category: "hoat-dong",
  },
  {
    id: "g-06",
    year: "20XX",
    title: "Lễ tốt nghiệp học viên sĩ quan khóa mẫu [Tư liệu]",
    caption: "Những tân sĩ quan tuyên thệ dưới Quân kỳ Quyết thắng trước khi về đơn vị mới [Dữ liệu mẫu]",
    source: "Cổng thông tin Nhà trường",
    url: createArchivalPlaceholderSvg("Lễ tốt nghiệp học viên sĩ quan", "20XX"),
    category: "nghi-le",
  },
];
