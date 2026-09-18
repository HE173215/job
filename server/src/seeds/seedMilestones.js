import { pathToFileURL } from "node:url";
import { connectDatabase, disconnectDatabase } from "../config/db.js";
import { Milestone } from "../models/Milestone.js";

const HISTORY_SOURCE =
  "https://www.qdnd.vn/nuoi-duong-van-hoa-bo-doi-cu-ho/phat-huy-truyen-thong-anh-hung-xay-dung-truong-si-quan-chinh-tri-vung-manh-toan-dien-mau-muc-tieu-bieu-811359";

export const milestoneSeed = [
  {
    year: 1976,
    date: "1976-01-14T00:00:00.000Z",
    title: "Thành lập Trường Sĩ quan Chính trị",
    slug: "thanh-lap-truong-si-quan-chinh-tri-1976",
    summary:
      "Ngày 14/01/1976, Trường Sĩ quan Chính trị được thành lập, có nhiệm vụ đào tạo chính trị viên đại đội cho toàn quân.",
    content:
      "Trường Sĩ quan Chính trị được thành lập ngày 14/01/1976 theo quyết định của Bộ trưởng Bộ Quốc phòng. Nhiệm vụ ban đầu của Nhà trường là đào tạo chính trị viên đại đội cho toàn quân.",
    era: "Giai đoạn xây dựng ban đầu",
    source:
      "https://www.qdnd.vn/tu-lieu-ho-so/ngay-nay-nam-xua/ngay-14-1-1976-ngay-thanh-lap-truong-si-quan-chinh-tri-682340",
    order: 10,
    featured: true,
    published: true,
  },
  {
    year: 1976,
    date: "1976-05-10T00:00:00.000Z",
    title: "Được giao địa bàn đóng quân tại Thành cổ Bắc Ninh",
    slug: "dia-ban-dong-quan-thanh-co-bac-ninh-1976",
    summary:
      "Ngày 10/05/1976, Nhà trường được giao địa bàn đóng quân tại Thành cổ Bắc Ninh, tỉnh Hà Bắc lúc bấy giờ.",
    content:
      "Theo Quyết định số 104/QĐ-TM ngày 10/05/1976 của Bộ Tổng Tham mưu Quân đội nhân dân Việt Nam, địa bàn đóng quân của Nhà trường được xác định tại Thành cổ Bắc Ninh, tỉnh Hà Bắc; nay thuộc thành phố Bắc Ninh, tỉnh Bắc Ninh.",
    era: "Giai đoạn xây dựng ban đầu",
    source: HISTORY_SOURCE,
    order: 20,
    featured: false,
    published: true,
  },
  {
    year: 1978,
    date: "1978-10-03T00:00:00.000Z",
    title: "Được xác định là trường Đảng trong hệ thống đại học Mác-Lênin",
    slug: "xac-dinh-vi-tri-truong-dang-1978",
    summary:
      "Ngày 03/10/1978, Ban Bí thư Trung ương Đảng xác định vị trí của Trường Sĩ quan Chính trị trong hệ thống đào tạo lý luận của Đảng.",
    content:
      "Quyết định số 28/QĐ-TW ngày 03/10/1978 của Ban Bí thư Trung ương Đảng xác định Trường Sĩ quan Chính trị là trường Đảng tập trung, giảng dạy chương trình lý luận trung cấp của Đảng và nằm trong hệ thống đại học Mác-Lênin.",
    era: "Giai đoạn xây dựng và phát triển",
    source: HISTORY_SOURCE,
    order: 30,
    featured: false,
    published: true,
  },
  {
    year: 1995,
    date: "1995-08-08T00:00:00.000Z",
    title: "Hợp nhất với Học viện Chính trị Quân sự",
    slug: "hop-nhat-hoc-vien-chinh-tri-quan-su-1995",
    summary:
      "Ngày 08/08/1995, Trường Sĩ quan Chính trị-Quân sự được hợp nhất với Học viện Chính trị Quân sự.",
    content:
      "Thực hiện quyết định của Bộ Quốc phòng ngày 08/08/1995, Trường Sĩ quan Chính trị-Quân sự được hợp nhất với Học viện Chính trị Quân sự. Bộ phận thực hiện nhiệm vụ đào tạo sĩ quan chính trị cấp phân đội tiếp tục hoạt động tại Cơ sở II.",
    era: "Giai đoạn hợp nhất",
    source: HISTORY_SOURCE,
    order: 40,
    featured: true,
    published: true,
  },
  {
    year: 2008,
    date: "2008-05-22T00:00:00.000Z",
    title: "Tái thành lập Trường Sĩ quan Chính trị",
    slug: "tai-thanh-lap-truong-si-quan-chinh-tri-2008",
    summary:
      "Ngày 22/05/2008, Bộ trưởng Bộ Quốc phòng quyết định thành lập Trường Sĩ quan Chính trị trực thuộc Bộ Quốc phòng.",
    content:
      "Quyết định số 69/2008/QĐ-BQP ngày 22/05/2008 thành lập Trường Sĩ quan Chính trị trực thuộc Bộ Quốc phòng trên cơ sở tách chức năng, nhiệm vụ, tổ chức và quân số đào tạo sĩ quan chính trị cấp phân đội thuộc Học viện Chính trị Quân sự.",
    era: "Giai đoạn tái thành lập và phát triển",
    source: HISTORY_SOURCE,
    order: 50,
    featured: true,
    published: true,
  },
  {
    year: 2010,
    title: "Thành lập Trường Đại học Chính trị",
    slug: "thanh-lap-truong-dai-hoc-chinh-tri-2010",
    summary:
      "Tháng 12/2010, Thủ tướng Chính phủ quyết định thành lập Trường Đại học Chính trị trên cơ sở nâng cấp Trường Sĩ quan Chính trị.",
    content:
      "Tháng 12/2010, Thủ tướng Chính phủ ký Quyết định số 2344/QĐ-TTg thành lập Trường Đại học Chính trị trên cơ sở nâng cấp Trường Sĩ quan Chính trị.",
    era: "Giai đoạn tái thành lập và phát triển",
    source:
      "https://www.qdnd.vn/quoc-phong-an-ninh/xay-dung-quan-doi/nang-cao-chat-luong-dao-tao-xay-dung-nha-truong-chinh-quy-tien-tien-mau-muc-434346",
    order: 60,
    featured: false,
    published: true,
  },
  {
    year: 2024,
    date: "2024-12-22T00:00:00.000Z",
    title: "Được phong tặng danh hiệu Anh hùng Lực lượng vũ trang nhân dân",
    slug: "anh-hung-luc-luong-vu-trang-nhan-dan-2024",
    summary:
      "Ngày 22/12/2024, Trường Sĩ quan Chính trị được phong tặng danh hiệu Anh hùng Lực lượng vũ trang nhân dân.",
    content:
      "Ngày 22/12/2024, Chủ tịch nước ký Quyết định số 1522/QĐ-CTN phong tặng danh hiệu Anh hùng Lực lượng vũ trang nhân dân cho Trường Sĩ quan Chính trị vì thành tích đặc biệt xuất sắc trong huấn luyện, giáo dục, đào tạo, xây dựng Quân đội và củng cố quốc phòng.",
    era: "Giai đoạn đổi mới và phát triển",
    source:
      "https://www.qdnd.vn/giao-duc-khoa-hoc/nha-truong-quan-doi/truong-si-quan-chinh-tri-don-nhan-danh-hieu-anh-hung-luc-luong-vu-trang-nhan-dan-811406",
    order: 70,
    featured: true,
    published: true,
  },
];

export const seedMilestones = async () => {
  await Promise.all(milestoneSeed.map((item) => new Milestone(item).validate()));
  const result = await Milestone.bulkWrite(
    milestoneSeed.map((item) => ({
      updateOne: {
        filter: { slug: item.slug },
        update: { $setOnInsert: item },
        upsert: true,
      },
    })),
  );

  return { inserted: result.upsertedCount, existing: milestoneSeed.length - result.upsertedCount };
};

const isDirectRun = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  connectDatabase()
    .then(seedMilestones)
    .then(({ inserted, existing }) => {
      console.info(`Milestone seed complete: ${inserted} inserted, ${existing} already existed`);
    })
    .catch((error) => {
      console.error("Milestone seed failed:", error.message);
      process.exitCode = 1;
    })
    .finally(disconnectDatabase);
}
