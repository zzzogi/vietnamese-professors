import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Danh sách các trường đại học Việt Nam
const universities = [
  "Đại học Quốc gia Hà Nội",
  "Đại học Quốc gia TP.HCM",
  "Đại học Bách Khoa Hà Nội",
  "Đại học Bách Khoa TP.HCM",
  "Đại học Kinh tế Quốc dân",
  "Đại học Ngoại thương",
  "Đại học Khoa học Tự nhiên",
  "Đại học Sư phạm Hà Nội",
  "Đại học Y Hà Nội",
  "Đại học Cần Thơ",
];

const departments = [
  "Khoa Khoa học Máy tính",
  "Khoa Kinh tế",
  "Khoa Quản trị Kinh doanh",
  "Khoa Công nghệ Thông tin",
  "Khoa Điện - Điện tử",
  "Khoa Hóa học",
  "Khoa Vật lý",
  "Khoa Toán - Tin học",
  "Khoa Ngoại ngữ",
  "Khoa Luật",
];

const majors = [
  "Khoa học Máy tính",
  "Công nghệ Thông tin",
  "Kinh tế học",
  "Quản trị Kinh doanh",
  "Kế toán",
  "Marketing",
  "Điện tử Viễn thông",
  "Cơ khí",
  "Hóa học",
  "Vật lý",
  "Toán học",
  "Tiếng Anh",
  "Luật",
  "Y khoa",
];

const locations = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Cần Thơ",
  "Hải Phòng",
  "Huế",
  "Nha Trang",
  "Vinh",
];

async function main() {
  console.log("🌱 Starting seed...");

  // Xóa dữ liệu cũ (optional)
  await prisma.professor.deleteMany();
  console.log("🗑️  Cleared existing professors");

  // Tạo 50 giáo sư giả
  const professors = [];

  for (let i = 0; i < 50; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${lastName} ${firstName}`;

    professors.push({
      name,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      university: faker.helpers.arrayElement(universities),
      department: faker.helpers.arrayElement(departments),
      major: faker.helpers.arrayElement(majors),
      location: faker.helpers.arrayElement(locations),
      bio: faker.lorem.paragraph(),
      imageUrl: faker.image.avatar(),
    });
  }

  // Insert vào database
  const result = await prisma.professor.createMany({
    data: professors,
  });

  console.log(`✅ Created ${result.count} professors`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
