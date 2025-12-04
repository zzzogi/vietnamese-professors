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

  // Xóa dữ liệu cũ
  console.log("🗑️  Clearing existing data...");
  await prisma.savedEmail.deleteMany();
  await prisma.professorRating.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.professor.deleteMany();

  console.log("✅ Cleared old data");

  // Tạo professors
  console.log("👨‍🏫 Creating professors...");
  const createdProfessors = [];

  for (let i = 0; i < 50; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${lastName} ${firstName}`;

    const numInterests = faker.number.int({ min: 2, max: 4 });
    const interests = faker.helpers.arrayElements(researchTopics, numInterests);

    const professor = await prisma.professor.create({
      data: {
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
      },
    });

    createdProfessors.push(professor);

    if ((i + 1) % 10 === 0) {
      console.log(`   Created ${i + 1}/50 professors...`);
    }
  }

  console.log(`✅ Created ${createdProfessors.length} professors`);

  // Lấy hoặc tạo users
  let users = await prisma.user.findMany();

  if (users.length === 0) {
    console.log("👤 Creating demo users...");
    const demoUsers = [];

    for (let i = 0; i < 10; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      const user = await prisma.user.create({
        data: {
          name: `${firstName} ${lastName}`,
          email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        },
      });

      demoUsers.push(user);
    }

    users = demoUsers;
    console.log(`✅ Created ${users.length} demo users`);
  } else {
    console.log(`✅ Using ${users.length} existing users`);
  }

  // ✅ FIX: Tạo ratings với random rating đơn giản
  console.log("⭐ Creating ratings...");
  const ratings = [];
  const ratingDates = generateDateRange(90);
  const usedPairs = new Set<string>();

  for (const professor of createdProfessors) {
    const numRatings = faker.number.int({ min: 3, max: 15 });
    const ratingUsers = faker.helpers.arrayElements(
      users,
      Math.min(numRatings, users.length)
    );

    for (const user of ratingUsers) {
      const pairKey = `${user.id}-${professor.id}`;

      if (usedPairs.has(pairKey)) continue;
      usedPairs.add(pairKey);

      // ✅ FIX: Simplified rating generation
      const randomValue = Math.random();
      let ratingValue: number;

      if (randomValue < 0.4) {
        ratingValue = 5;
      } else if (randomValue < 0.75) {
        ratingValue = 4;
      } else if (randomValue < 0.95) {
        ratingValue = 3;
      } else if (randomValue < 0.99) {
        ratingValue = 2;
      } else {
        ratingValue = 1;
      }

      ratings.push({
        userId: user.id,
        professorId: professor.id,
        rating: ratingValue,
        createdAt: faker.helpers.arrayElement(ratingDates),
      });
    }
  }

  const createdRatings = await prisma.professorRating.createMany({
    data: ratings,
  });

  console.log(`✅ Created ${createdRatings.count} ratings`);

  // Tạo saved emails
  console.log("📧 Creating saved emails...");
  const savedEmails = [];
  const emailDates = generateDateRange(90);

  const emailSubjects = [
    "Research Opportunity Inquiry",
    "PhD Application - Prospective Student",
    "Collaboration Proposal",
    "Internship Request",
    "Research Question About Your Work",
    "Meeting Request - Graduate Studies",
    "Inquiry About Lab Position",
    "Question Regarding Your Recent Publication",
  ];

  const emailTemplates = [
    "Dear Professor, I am writing to express my interest in your research on {topic}. I would be grateful for the opportunity to discuss potential research opportunities.",
    "Hello Professor, I am a student interested in {topic}. I have read your recent publications and would love to learn more about your work.",
    "Dear Professor, I am applying for PhD programs and am very interested in your research group. Could we schedule a time to discuss potential opportunities?",
  ];

  const numEmails = faker.number.int({ min: 100, max: 200 });

  for (let i = 0; i < numEmails; i++) {
    const user = faker.helpers.arrayElement(users);
    const professor = faker.helpers.arrayElement(createdProfessors);
    const topic = faker.helpers.arrayElement(professor.researchInterests);

    savedEmails.push({
      userId: user.id,
      professorId: professor.id,
      subject: faker.helpers.arrayElement(emailSubjects),
      content: faker.helpers
        .arrayElement(emailTemplates)
        .replace("{topic}", topic),
      language: faker.helpers.arrayElement(["en", "vi"]),
      createdAt: faker.helpers.arrayElement(emailDates),
    });
  }

  const createdEmails = await prisma.savedEmail.createMany({
    data: savedEmails,
  });

  console.log(`✅ Created ${createdEmails.count} saved emails`);

  // Tạo bookmarks
  console.log("🔖 Creating bookmarks...");
  const bookmarks = [];
  const numBookmarks = faker.number.int({ min: 30, max: 50 });
  const usedBookmarkPairs = new Set<string>();

  let attempts = 0;
  while (bookmarks.length < numBookmarks && attempts < numBookmarks * 3) {
    attempts++;

    const user = faker.helpers.arrayElement(users);
    const professor = faker.helpers.arrayElement(createdProfessors);
    const pairKey = `${user.id}-${professor.id}`;

    if (usedBookmarkPairs.has(pairKey)) continue;
    usedBookmarkPairs.add(pairKey);

    bookmarks.push({
      userId: user.id,
      professorId: professor.id,
      createdAt: faker.helpers.arrayElement(emailDates),
    });
  }

  const createdBookmarks = await prisma.bookmark.createMany({
    data: bookmarks,
  });

  console.log(`✅ Created ${createdBookmarks.count} bookmarks`);

  // Summary
  console.log("\n📊 Seed Summary:");
  console.log(`   👨‍🏫 Professors: ${createdProfessors.length}`);
  console.log(`   👤 Users: ${users.length}`);
  console.log(`   ⭐ Ratings: ${createdRatings.count}`);
  console.log(`   📧 Saved Emails: ${createdEmails.count}`);
  console.log(`   🔖 Bookmarks: ${createdBookmarks.count}`);
  console.log("\n✨ Seed completed successfully!");
}

function generateDateRange(daysAgo: number): Date[] {
  const dates: Date[] = [];
  const now = new Date();

  for (let i = 0; i < daysAgo; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    date.setHours(faker.number.int({ min: 0, max: 23 }));
    date.setMinutes(faker.number.int({ min: 0, max: 59 }));
    dates.push(date);
  }

  return dates;
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
