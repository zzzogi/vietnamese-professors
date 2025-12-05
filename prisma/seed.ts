import { PrismaClient, UserRole } from "@prisma/client";
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

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.usageLog.deleteMany();
  await prisma.savedEmail.deleteMany();
  await prisma.professorRating.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleared old data");

  // ✅ Create professors (50 total, 10 PRO-only)
  console.log("👨‍🏫 Creating professors...");
  const createdProfessors = [];

  for (let i = 0; i < 50; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${lastName} ${firstName}`;

    const numInterests = faker.number.int({ min: 2, max: 4 });
    const interests = faker.helpers.arrayElements(researchTopics, numInterests);

    // ✅ Mark last 10 professors as PRO-only
    const isPro = i >= 40;

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
        isPro, // ✅ NEW
      },
    });

    createdProfessors.push(professor);

    if ((i + 1) % 10 === 0) {
      console.log(
        `   Created ${i + 1}/50 professors... (${isPro ? "PRO" : "Public"})`
      );
    }
  }

  console.log(
    `✅ Created ${createdProfessors.length} professors (10 PRO-only)`
  );

  // ✅ Create users with different roles
  console.log("👤 Creating demo users...");
  const demoUsers = [];

  // 1 PRO user
  const proUser = await prisma.user.create({
    data: {
      name: "Pro User",
      email: "pro@example.com",
      role: UserRole.PRO,
      isPro: true,
      emailQuota: 999,
      emailsUsed: 0,
      quotaResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      proExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    },
  });
  demoUsers.push(proUser);

  // 9 regular users
  for (let i = 0; i < 9; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const emailsUsed = faker.number.int({ min: 0, max: 7 });

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        role: UserRole.USER,
        isPro: false,
        emailQuota: 10,
        emailsUsed,
        quotaResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    demoUsers.push(user);
  }

  console.log(`✅ Created ${demoUsers.length} demo users (1 PRO, 9 free)`);

  // Create ratings
  console.log("⭐ Creating ratings...");
  const ratings = [];
  const ratingDates = generateDateRange(90);
  const usedPairs = new Set<string>();

  for (const professor of createdProfessors) {
    const numRatings = faker.number.int({ min: 3, max: 15 });
    const ratingUsers = faker.helpers.arrayElements(
      demoUsers,
      Math.min(numRatings, demoUsers.length)
    );

    for (const user of ratingUsers) {
      const pairKey = `${user.id}-${professor.id}`;

      if (usedPairs.has(pairKey)) continue;
      usedPairs.add(pairKey);

      // Weighted random rating (skewed towards higher ratings)
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

  // Create saved emails
  console.log("📧 Creating saved emails...");
  const savedEmails = [];
  const emailDates = generateDateRange(90);

  const emailSubjects = [
    "Yêu cầu tham gia nghiên cứu",
    "Đăng ký học PhD - Sinh viên tiềm năng",
    "Đề xuất hợp tác nghiên cứu",
    "Xin thực tập tại phòng lab",
    "Câu hỏi về công trình nghiên cứu",
    "Xin hẹn gặp - Tư vấn sau đại học",
    "Hỏi về vị trí nghiên cứu",
    "Câu hỏi về bài báo gần đây",
  ];

  const emailTemplates = [
    "Kính gửi Thầy/Cô, Em là sinh viên quan tâm đến lĩnh vực {topic}. Em rất mong được thảo luận về cơ hội nghiên cứu.",
    "Xin chào Thầy/Cô, Em đã đọc các công trình nghiên cứu về {topic} và rất muốn tìm hiểu thêm về công việc của Thầy/Cô.",
    "Kính gửi Thầy/Cô, Em đang xin học PhD và rất quan tâm đến nhóm nghiên cứu của Thầy/Cô. Liệu chúng ta có thể sắp xếp thời gian trao đổi không ạ?",
  ];

  const numEmails = faker.number.int({ min: 100, max: 200 });

  for (let i = 0; i < numEmails; i++) {
    const user = faker.helpers.arrayElement(demoUsers);
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

  // Create bookmarks
  console.log("🔖 Creating bookmarks...");
  const bookmarks = [];
  const numBookmarks = faker.number.int({ min: 30, max: 50 });
  const usedBookmarkPairs = new Set<string>();

  let attempts = 0;
  while (bookmarks.length < numBookmarks && attempts < numBookmarks * 3) {
    attempts++;

    const user = faker.helpers.arrayElement(demoUsers);
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

  // ✅ Create usage logs
  console.log("📊 Creating usage logs...");
  const usageLogs = [];
  const actions = [
    "email_generated",
    "profile_viewed",
    "bookmark_added",
    "search_performed",
  ];

  for (let i = 0; i < 200; i++) {
    usageLogs.push({
      userId: faker.helpers.arrayElement(demoUsers).id,
      action: faker.helpers.arrayElement(actions),
      metadata: {},
      createdAt: faker.helpers.arrayElement(emailDates),
    });
  }

  const createdLogs = await prisma.usageLog.createMany({
    data: usageLogs,
  });

  console.log(`✅ Created ${createdLogs.count} usage logs`);

  // Summary
  console.log("\n📊 Seed Summary:");
  console.log(`   👨‍🏫 Professors: ${createdProfessors.length} (10 PRO-only)`);
  console.log(`   👤 Users: ${demoUsers.length} (1 PRO, 9 free)`);
  console.log(`   ⭐ Ratings: ${createdRatings.count}`);
  console.log(`   📧 Saved Emails: ${createdEmails.count}`);
  console.log(`   🔖 Bookmarks: ${createdBookmarks.count}`);
  console.log(`   📊 Usage Logs: ${createdLogs.count}`);
  console.log("\n✨ Seed completed successfully!");
  console.log("\n🔑 Test Accounts:");
  console.log("   PRO User: pro@example.com");
  console.log("   Free Users: Check database for other emails");
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
