import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

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

const researchTopics = [
  "Machine Learning",
  "Artificial Intelligence",
  "Data Science",
  "Blockchain Technology",
  "Internet of Things",
  "Cybersecurity",
  "Cloud Computing",
  "Computer Vision",
  "Natural Language Processing",
  "Quantum Computing",
  "Business Analytics",
  "Financial Economics",
  "Marketing Strategy",
  "Supply Chain Management",
  "Organizational Behavior",
  "Corporate Finance",
  "International Trade",
  "Tourism Development",
  "Sustainable Development",
  "Environmental Science",
];

async function main() {
  console.log("🌱 Starting seed...");

  await prisma.professor.deleteMany();
  console.log("🗑️  Cleared existing professors");

  const professors = [];

  for (let i = 0; i < 50; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${lastName} ${firstName}`;

    // Random 2-4 research interests
    const numInterests = faker.number.int({ min: 2, max: 4 });
    const interests = faker.helpers.arrayElements(researchTopics, numInterests);

    professors.push({
      name,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      university: faker.helpers.arrayElement(universities),
      department: faker.helpers.arrayElement(departments),
      major: faker.helpers.arrayElement(majors),
      location: faker.helpers.arrayElement(locations),
      bio: faker.lorem.paragraph(),
      imageUrl: faker.image.avatar(),
      researchInterests: interests,
      googleScholarUrl: faker.datatype.boolean()
        ? `https://scholar.google.com/citations?user=${faker.string.alphanumeric(
            12
          )}`
        : null,
      publicationUrl: faker.datatype.boolean() ? faker.internet.url() : null,
    });
  }

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
