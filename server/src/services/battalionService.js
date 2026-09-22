import { Battalion } from "../models/Battalion.js";
import { AppError } from "../utils/AppError.js";
import { escapeRegex } from "../utils/query.js";

const DEFAULT_BATTALIONS = [
  {
    code: "d1",
    name: "Tiểu đoàn 1",
    fullName: "Tiểu đoàn Quản lý Học viên 1",
    emblemTitle: "Đơn vị Lá cờ đầu",
    slogan: "Đoàn kết – Kỷ luật – Kiên cường – Quyết thắng",
    tradition:
      "Là đơn vị có bề dày thành tích trong phong trào thi đua Quyết thắng của Nhà trường. Tiểu đoàn luôn giữ vững ngọn cờ đầu trong quản lý, rèn luyện bộ đội, bồi dưỡng bản lĩnh chính trị kiên định và phong cách người chính trị viên mẫu mực.",
    mission:
      "Quản lý, rèn luyện và tổ chức học tập toàn diện cho học viên đào tạo sĩ quan chính trị cấp phân đội; duy trì nghiêm nền nếp chế độ chính quy, kỷ luật quân đội.",
    stats: {
      established: "Gắn liền với các mốc phát triển vẻ vang của trường",
      highlight: "Nhiều năm liền đạt danh hiệu Đơn vị Quyết thắng",
    },
    order: 1,
    posts: [
      {
        title: "Hội thi cán bộ giảng bài chính trị và phương pháp công tác đảng cấp Tiểu đoàn",
        date: "2026-03-15",
        category: "Học tập & Giảng dạy",
        excerpt:
          "Học viên các đại đội sôi nổi tranh tài phương pháp giảng dạy lý luận chính trị, vận dụng linh hoạt công nghệ thông tin và minh họa trực quan.",
        imageUrl:
          "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
        author: "Ban Thông tin Tiểu đoàn 1",
      },
      {
        title: "Hành quân rèn luyện dã ngoại kết hợp làm công tác dân vận",
        date: "2026-02-28",
        category: "Rèn luyện thao trường",
        excerpt:
          "Cán bộ, học viên Tiểu đoàn hoàn thành xuất sắc đợt hành quân dã ngoại, giúp đỡ nhân dân địa phương vệ sinh môi trường và tu sửa đường làng.",
        imageUrl:
          "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
        author: "Ban Thông tin Tiểu đoàn 1",
      },
      {
        title: "Giao lưu văn nghệ - thể thao chào mừng ngày truyền thống Nhà trường",
        date: "2026-01-14",
        category: "Hoạt động phong trào",
        excerpt:
          "Không khí thi đua sôi nổi với các tiết mục hát múa ca ngợi Đảng, Bác Hồ, Quân đội và tình đoàn kết gắn bó keo sơn.",
        imageUrl:
          "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
        author: "Ban Thông tin Tiểu đoàn 1",
      },
    ],
  },
  {
    code: "d2",
    name: "Tiểu đoàn 2",
    fullName: "Tiểu đoàn Quản lý Học viên 2",
    emblemTitle: "Đơn vị Huấn luyện giỏi",
    slogan: "Dạy tốt – Học tốt – Rèn nghiêm – Tác phong mẫu mực",
    tradition:
      "Kế thừa truyền thống kiên cường vượt khó, Tiểu đoàn 2 luôn chú trọng gắn lý luận trường lớp với thực tế đơn vị, xây dựng tác phong chính quy, cảnh quan xanh - sạch - đẹp.",
    mission:
      "Đào tạo cán bộ chính trị có phẩm chất đạo đức cách mạng trong sáng, năng lực tiến hành công tác đảng, công tác chính trị toàn diện.",
    stats: {
      established: "Đơn vị nòng cốt trong phong trào dạy tốt, học tốt",
      highlight: "100% học viên hoàn thành chuẩn đầu ra",
    },
    order: 2,
    posts: [
      {
        title: "Diễn tập chiến thuật phân đội và xử trí tình huống chính trị tư tưởng",
        date: "2026-03-10",
        category: "Huấn luyện chiến thuật",
        excerpt:
          "Đợt diễn thực tế giúp học viên nâng cao năng lực định hướng tư tưởng cho chiến sĩ trong điều kiện hành quân tác chiến phức tạp.",
        imageUrl:
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
        author: "Ban Thông tin Tiểu đoàn 2",
      },
      {
        title: "Tọa đàm thanh niên: Vững bước dưới cờ vinh quang của Đảng",
        date: "2026-02-20",
        category: "Giáo dục tư tưởng",
        excerpt:
          "Đoàn viên thanh niên Tiểu đoàn khẳng định quyết tâm rèn đức, luyện tài, xứng danh người sĩ quan chính trị ưu tú.",
        imageUrl:
          "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
        author: "Ban Thông tin Tiểu đoàn 2",
      },
    ],
  },
  {
    code: "d3",
    name: "Tiểu đoàn 3",
    fullName: "Tiểu đoàn Quản lý Học viên 3",
    emblemTitle: "Đơn vị Chính quy mẫu mực",
    slogan: "Chủ động – Sáng tạo – Kỷ cương – Trách nhiệm",
    tradition:
      "Nổi bật với nền nếp chính quy, tính kỷ luật tự giác nghiêm minh, Tiểu đoàn 3 luôn đạt tỉ lệ khen thưởng cao trong các đợt thi đua cao điểm của Nhà trường.",
    mission:
      "Xây dựng môi trường sư phạm quân sự chuẩn mực, tạo chuyển biến vững chắc về lễ tiết tác phong quân nhân và phẩm chất người thầy giáo, cán bộ chính trị.",
    stats: {
      established: "Cái nôi rèn luyện kỷ luật thép",
      highlight: "Đạt giải cao tại Hội thao quân sự toàn trường",
    },
    order: 3,
    posts: [
      {
        title: "Kiểm tra bắn đạn thật bài 1 súng tiểu liên AK cho học viên",
        date: "2026-03-05",
        category: "Huấn luyện quân sự",
        excerpt:
          "Kết quả 100% đạt yêu cầu, trong đó trên 85% đạt loại khá và giỏi, bảo đảm an toàn tuyệt đối về người và vũ khí trang bị.",
        imageUrl:
          "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80",
        author: "Ban Thông tin Tiểu đoàn 3",
      },
      {
        title: "Hội thi phòng Hồ Chí Minh và bảng tin thi đua xuất sắc",
        date: "2026-01-22",
        category: "Văn hóa quân sự",
        excerpt:
          "Phát huy hiệu quả thiết chế văn hóa cơ sở, tạo không gian sinh hoạt tư tưởng lành mạnh, phong phú cho bộ đội.",
        imageUrl:
          "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
        author: "Ban Thông tin Tiểu đoàn 3",
      },
    ],
  },
  {
    code: "d4",
    name: "Tiểu đoàn 4",
    fullName: "Tiểu đoàn Quản lý Học viên 4",
    emblemTitle: "Đơn vị Xung kích sáng tạo",
    slogan: "Vượt nắng thắng mưa – Say sưa luyện tập",
    tradition:
      "Tiểu đoàn 4 luôn đi đầu trong nghiên cứu khoa học xã hội nhân văn quân sự trẻ, ứng dụng chuyển đổi số và phương pháp giảng dạy hiện đại vào học tập.",
    mission:
      "Đào tạo đội ngũ học viên có tư duy lý luận sâu sắc, khả năng nghiên cứu độc lập và kỹ năng xử trí linh hoạt trong công tác tư tưởng.",
    stats: {
      established: "Đơn vị đi đầu nghiên cứu khoa học trẻ",
      highlight: "Nhiều đề tài Tuổi trẻ sáng tạo đạt giải cấp Bộ Quốc phòng",
    },
    order: 4,
    posts: [
      {
        title: "Câu lạc bộ Sĩ quan trẻ sinh hoạt chuyên đề bảo vệ nền tảng tư tưởng của Đảng",
        date: "2026-03-12",
        category: "Nghiên cứu khoa học",
        excerpt:
          "Thảo luận sâu sắc về đấu tranh phản bác các quan điểm sai trái, thù địch trên không gian mạng hiện nay.",
        imageUrl:
          "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
        author: "Ban Thông tin Tiểu đoàn 4",
      },
      {
        title: "Giải bóng chuyền truyền thống chào mừng Ngày thành lập Đoàn 26/3",
        date: "2026-03-01",
        category: "Thể thao rèn luyện",
        excerpt:
          "Các trận đấu diễn ra kịch tính, hấp dẫn, thắt chặt tinh thần đồng đội và nâng cao sức khỏe bền bỉ cho học viên.",
        imageUrl:
          "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80",
        author: "Ban Thông tin Tiểu đoàn 4",
      },
    ],
  },
  {
    code: "d5",
    name: "Tiểu đoàn 5",
    fullName: "Tiểu đoàn Quản lý Học viên 5",
    emblemTitle: "Đơn vị Kiên trung bất khuất",
    slogan: "Vững vàng chính trị – Giỏi chuyên môn – Tinh thông nghiệp vụ",
    tradition:
      "Giữ vững bản sắc anh hùng, Tiểu đoàn 5 đào tạo học viên với bản lĩnh chính trị vững vàng trước mọi thử thách, luôn sẵn sàng nhận và hoàn thành mọi nhiệm vụ được giao.",
    mission:
      "Quản lý, đào tạo học viên các khóa hoàn thành xuất sắc các nội dung thực tập chính trị viên phân đội tại các đơn vị trong toàn quân.",
    stats: {
      established: "Đơn vị giàu truyền thống thực tế",
      highlight: "Học viên tốt nghiệp 100% yên tâm công tác tại mọi miền Tổ quốc",
    },
    order: 5,
    posts: [
      {
        title: "Lễ xuất quân đi thực tập chức trách Chính trị viên đại đội",
        date: "2026-02-15",
        category: "Thực tế đơn vị",
        excerpt:
          "Học viên Tiểu đoàn lên đường về các quân đoàn, sư đoàn để trực tiếp đảm nhiệm cương vị chỉ trị viên phân đội.",
        imageUrl:
          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
        author: "Ban Thông tin Tiểu đoàn 5",
      },
    ],
  },
  {
    code: "d6",
    name: "Tiểu đoàn 6",
    fullName: "Tiểu đoàn Quản lý Học viên 6",
    emblemTitle: "Đơn vị Mẫu mực tiêu biểu",
    slogan: "Kiên định mục tiêu – Nêu cao gương mẫu",
    tradition:
      "Xây dựng tập thể đoàn kết gắn bó, phát huy dân chủ quân sự gắn liền với giữ vững kỷ cương, là điểm sáng trong công tác xây dựng Đảng bộ bộ phận trong sạch vững mạnh.",
    mission:
      "Rèn luyện học viên về phương pháp tổ chức sinh hoạt đảng, sinh hoạt đoàn thể và năng lực đối thoại, giáo dục chính trị tại đơn vị cơ sở.",
    stats: {
      established: "Tập thể đoàn kết kiểu mẫu",
      highlight: "Đảng bộ hoàn thành xuất sắc nhiệm vụ",
    },
    order: 6,
    posts: [
      {
        title: "Sinh hoạt Chi bộ kiểu mẫu và đối thoại dân chủ định kỳ",
        date: "2026-03-08",
        category: "Công tác Đảng",
        excerpt:
          "Bảo đảm tính dân chủ, cởi mở, lắng nghe tâm tư nguyện vọng của từng học viên và giải quyết kịp thời khó khăn vướng mắc.",
        imageUrl:
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
        author: "Ban Thông tin Tiểu đoàn 6",
      },
    ],
  },
  {
    code: "d7",
    name: "Tiểu đoàn 7",
    fullName: "Tiểu đoàn Quản lý Học viên 7",
    emblemTitle: "Đơn vị Đoàn kết hiệp đồng",
    slogan: "Kỷ luật là sức mạnh – Tình thương là cội nguồn",
    tradition:
      "Xây dựng mối quan hệ cán - binh thân thiết như anh em một nhà, chú trọng bồi dưỡng kỹ năng nắm bắt, quản lý và định hướng tư tưởng quân nhân.",
    mission:
      "Tổ chức giáo dục, huấn luyện chuyên sâu về tâm lý học quân sự, công tác tư tưởng và đạo đức cách mạng.",
    stats: {
      established: "Vững vàng phẩm chất người cán bộ chính trị",
      highlight: "Đơn vị dân vận khéo tiêu biểu",
    },
    order: 7,
    posts: [
      {
        title: "Chương trình Ngày Chủ nhật xanh và tình nguyện vì cộng đồng",
        date: "2026-02-18",
        category: "Dân vận & Tình nguyện",
        excerpt:
          "Cán bộ chiến sĩ Tiểu đoàn 7 thăm hỏi tặng quà các gia đình chính sách và vệ sinh các di tích lịch sử trên địa bàn.",
        imageUrl:
          "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
        author: "Ban Thông tin Tiểu đoàn 7",
      },
    ],
  },
  {
    code: "d8",
    name: "Tiểu đoàn 8",
    fullName: "Tiểu đoàn Quản lý Học viên 8",
    emblemTitle: "Đơn vị Tiếp bước truyền thống",
    slogan: "Rèn đức luyện tài – Vững bước tương lai",
    tradition:
      "Là nơi tiếp nhận và rèn luyện các thế hệ học viên khóa mới, giúp học viên nhanh chóng hòa nhập với môi trường quân đội và xác định tốt động cơ phấn đấu.",
    mission:
      "Huấn luyện cơ bản, xây dựng nhận thức chính trị ban đầu và rèn luyện tác phong chính quy cho các khóa học viên mới vào trường.",
    stats: {
      established: "Khởi đầu vững chắc cho các thế hệ sĩ quan tương lai",
      highlight: "Chuyển biến nhận thức và tác phong nhanh chóng, vững chắc",
    },
    order: 8,
    posts: [
      {
        title: "Lễ tuyên thệ chiến sĩ mới và phát động phong trào thi đua năm học mới",
        date: "2026-01-10",
        category: "Lễ nghi quân sự",
        excerpt:
          "Khoảnh khắc trang nghiêm trước Quân kỳ Quyết thắng, khắc sâu 10 lời thề danh dự của quân nhân Quân đội nhân dân Việt Nam.",
        imageUrl:
          "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=800&q=80",
        author: "Ban Thông tin Tiểu đoàn 8",
      },
    ],
  },
];

export const battalionService = {
  async listPublished() {
    return Battalion.find().sort({ order: 1 }).select("-__v").lean();
  },

  async listAdmin(query = {}) {
    const filter = {};
    if (query.search) {
      const pattern = new RegExp(escapeRegex(query.search), "i");
      filter.$or = [
        { name: pattern },
        { fullName: pattern },
        { code: pattern },
        { emblemTitle: pattern },
      ];
    }
    return Battalion.find(filter).sort({ order: 1 }).select("-__v").lean();
  },

  async getByCodeOrId(identifier) {
    const isId = /^[0-9a-fA-F]{24}$/.test(identifier);
    const item = isId
      ? await Battalion.findById(identifier).select("-__v").lean()
      : await Battalion.findOne({ code: identifier.toLowerCase() }).select("-__v").lean();

    if (!item) throw new AppError(404, "Đơn vị Tiểu đoàn không tồn tại");
    return item;
  },

  async create(data) {
    if (!data.code) {
      data.code = (data.name || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    const existing = await Battalion.findOne({ code: data.code.toLowerCase() });
    if (existing) {
      throw new AppError(409, `Mã tiểu đoàn '${data.code}' đã tồn tại`);
    }

    const item = await Battalion.create(data);
    return item.toObject({ versionKey: false });
  },

  async update(idOrCode, data) {
    const isId = /^[0-9a-fA-F]{24}$/.test(idOrCode);
    const filter = isId ? { _id: idOrCode } : { code: idOrCode.toLowerCase() };

    if (data.code) {
      const existing = await Battalion.findOne({
        code: data.code.toLowerCase(),
        ...(isId ? { _id: { $ne: idOrCode } } : { code: { $ne: idOrCode.toLowerCase() } }),
      });
      if (existing) {
        throw new AppError(409, `Mã tiểu đoàn '${data.code}' đã tồn tại`);
      }
    }

    const item = await Battalion.findOneAndUpdate(filter, data, {
      new: true,
      runValidators: true,
    })
      .select("-__v")
      .lean();

    if (!item) throw new AppError(404, "Đơn vị Tiểu đoàn không tồn tại");
    return item;
  },

  async remove(idOrCode) {
    const isId = /^[0-9a-fA-F]{24}$/.test(idOrCode);
    const filter = isId ? { _id: idOrCode } : { code: idOrCode.toLowerCase() };
    const item = await Battalion.findOneAndDelete(filter).select("-__v").lean();
    if (!item) throw new AppError(404, "Đơn vị Tiểu đoàn không tồn tại");
    return item;
  },

  async addPost(id, postData) {
    const item = await Battalion.findById(id);
    if (!item) throw new AppError(404, "Đơn vị Tiểu đoàn không tồn tại");

    item.posts.unshift(postData);
    await item.save();
    return item.toObject({ versionKey: false });
  },

  async removePost(id, postId) {
    const item = await Battalion.findById(id);
    if (!item) throw new AppError(404, "Đơn vị Tiểu đoàn không tồn tại");

    item.posts = item.posts.filter((p) => p._id.toString() !== postId);
    await item.save();
    return item.toObject({ versionKey: false });
  },

  async resetDefaults() {
    await Battalion.deleteMany({});
    const created = await Battalion.insertMany(DEFAULT_BATTALIONS);
    return created.map((b) => b.toObject({ versionKey: false }));
  },
};
