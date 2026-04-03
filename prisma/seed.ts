import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Demo Users ──────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123456", 12);
  const studentPassword = await bcrypt.hash("student123456", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@apple9.com" },
    update: {},
    create: {
      name: "Apple 9 Admin",
      email: "admin@apple9.com",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  const mediaDirPassword = await bcrypt.hash("media123456", 12);
  await prisma.user.upsert({
    where: { email: "media@apple9.com" },
    update: {},
    create: {
      name: "Media Director",
      email: "media@apple9.com",
      password: mediaDirPassword,
      role: "MEDIA_DIRECTOR",
      emailVerified: new Date(),
    },
  });

  await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      name: "Jane Student",
      email: "student@example.com",
      password: studentPassword,
      role: "STUDENT",
      emailVerified: new Date(),
      nationality: "Nigerian",
    },
  });

  console.log("✅ Users seeded");

  // ─── Colleges ────────────────────────────────────────────────────────────────
  const colleges = [
    {
      name: "University of Toronto",
      country: "Canada",
      city: "Toronto",
      programs: ["Computer Science", "Engineering", "Business", "Medicine", "Arts"],
      tuitionMin: 22000,
      tuitionMax: 58000,
      scholarshipAvailable: true,
      description:
        "One of Canada's leading research universities, consistently ranked among the world's top 25 universities. Known for its diverse academic offerings and vibrant campus life in the heart of Toronto.",
      website: "https://www.utoronto.ca",
      ranking: 21,
      acceptanceRate: 43,
      featured: true,
    },
    {
      name: "University of British Columbia",
      country: "Canada",
      city: "Vancouver",
      programs: ["Environmental Science", "Engineering", "Law", "Medicine", "Business"],
      tuitionMin: 20000,
      tuitionMax: 52000,
      scholarshipAvailable: true,
      description:
        "Situated between the Pacific Ocean and the North Shore Mountains, UBC is consistently ranked among the world's top 40 universities with world-class research facilities.",
      website: "https://www.ubc.ca",
      ranking: 34,
      acceptanceRate: 52,
      featured: true,
    },
    {
      name: "University of Manchester",
      country: "United Kingdom",
      city: "Manchester",
      programs: ["Physics", "Business", "Computer Science", "Social Sciences", "Engineering"],
      tuitionMin: 18000,
      tuitionMax: 30000,
      scholarshipAvailable: true,
      description:
        "A global leader in research and education, the University of Manchester has produced 25 Nobel Prize winners. It is at the forefront of advancing knowledge and solving global challenges.",
      website: "https://www.manchester.ac.uk",
      ranking: 28,
      acceptanceRate: 57,
      featured: true,
    },
    {
      name: "King's College London",
      country: "United Kingdom",
      city: "London",
      programs: ["Law", "Medicine", "Arts & Humanities", "Business", "Natural Sciences"],
      tuitionMin: 19000,
      tuitionMax: 35000,
      scholarshipAvailable: true,
      description:
        "One of England's oldest universities, King's College London is a world-leading research and teaching university located in the heart of London, within walking distance of the Houses of Parliament.",
      website: "https://www.kcl.ac.uk",
      ranking: 40,
      acceptanceRate: 49,
    },
    {
      name: "Technical University of Munich (TUM)",
      country: "Germany",
      city: "Munich",
      programs: ["Engineering", "Computer Science", "Natural Sciences", "Medicine", "Business"],
      tuitionMin: 0,
      tuitionMax: 2000,
      scholarshipAvailable: true,
      description:
        "Germany's top technical university and one of the best in Europe. TUM charges minimal semester fees and offers education of the highest quality in a city rated one of the world's most liveable.",
      website: "https://www.tum.de",
      ranking: 50,
      acceptanceRate: 38,
      featured: true,
    },
    {
      name: "Humboldt University of Berlin",
      country: "Germany",
      city: "Berlin",
      programs: ["Arts & Humanities", "Social Sciences", "Law", "Medicine", "Natural Sciences"],
      tuitionMin: 0,
      tuitionMax: 1500,
      scholarshipAvailable: true,
      description:
        "Founded in 1810, Humboldt University is one of Germany's most prestigious institutions and the oldest university in Berlin, known for its strong humanities and social sciences programs.",
      website: "https://www.hu-berlin.de",
      ranking: 120,
      acceptanceRate: 45,
    },
    {
      name: "University of Melbourne",
      country: "Australia",
      city: "Melbourne",
      programs: ["Law", "Medicine", "Engineering", "Arts", "Business"],
      tuitionMin: 28000,
      tuitionMax: 48000,
      scholarshipAvailable: true,
      description:
        "Australia's leading university and a member of the prestigious Group of Eight. The University of Melbourne consistently places in the top 35 universities worldwide.",
      website: "https://www.unimelb.edu.au",
      ranking: 33,
      acceptanceRate: 70,
      featured: true,
    },
    {
      name: "Australian National University",
      country: "Australia",
      city: "Canberra",
      programs: ["Political Science", "Law", "Sciences", "Arts", "Engineering"],
      tuitionMin: 26000,
      tuitionMax: 45000,
      scholarshipAvailable: true,
      description:
        "ANU is Australia's national university and is consistently ranked in the top 30 globally. Located in the nation's capital, it has strong ties to government and policy research.",
      website: "https://www.anu.edu.au",
      ranking: 30,
      acceptanceRate: 65,
    },
    {
      name: "University of Amsterdam",
      country: "Netherlands",
      city: "Amsterdam",
      programs: ["Economics", "Law", "Social Sciences", "Humanities", "Natural Sciences"],
      tuitionMin: 2200,
      tuitionMax: 15000,
      scholarshipAvailable: true,
      description:
        "One of Europe's leading research universities, the University of Amsterdam offers a wide variety of English-taught degree programmes and is set in one of Europe's most international cities.",
      website: "https://www.uva.nl",
      ranking: 55,
      acceptanceRate: 52,
    },
    {
      name: "University of Cape Town",
      country: "South Africa",
      city: "Cape Town",
      programs: ["Medicine", "Commerce", "Engineering", "Law", "Humanities"],
      tuitionMin: 3000,
      tuitionMax: 12000,
      scholarshipAvailable: true,
      description:
        "Africa's leading university and consistently ranked among the world's top 200 universities. UCT is renowned for its research excellence and beautiful campus overlooking Cape Town.",
      website: "https://www.uct.ac.za",
      ranking: 171,
      acceptanceRate: 10,
      featured: true,
    },
    {
      name: "University of Ghana",
      country: "Ghana",
      city: "Accra",
      programs: ["Business", "Law", "Engineering", "Medicine", "Arts & Social Sciences"],
      tuitionMin: 800,
      tuitionMax: 4000,
      scholarshipAvailable: true,
      description:
        "The premier university in Ghana and one of the top institutions in West Africa. Known for its strong academic programs and contribution to national development.",
      website: "https://www.ug.edu.gh",
      ranking: 801,
      acceptanceRate: 35,
    },
    {
      name: "National University of Singapore",
      country: "Singapore",
      city: "Singapore",
      programs: ["Engineering", "Computing", "Business", "Medicine", "Law"],
      tuitionMin: 16000,
      tuitionMax: 40000,
      scholarshipAvailable: true,
      description:
        "Asia's top university and a global top-10 institution, NUS offers the largest selection of courses in Singapore across 17 faculties and schools.",
      website: "https://www.nus.edu.sg",
      ranking: 8,
      acceptanceRate: 22,
      featured: true,
    },
    {
      name: "University of Tokyo",
      country: "Japan",
      city: "Tokyo",
      programs: ["Engineering", "Sciences", "Law", "Economics", "Medicine"],
      tuitionMin: 5000,
      tuitionMax: 8000,
      scholarshipAvailable: true,
      description:
        "Japan's most prestigious university, established in 1877. UTokyo is consistently ranked Asia's second best university and has produced 11 Nobel Prize winners.",
      website: "https://www.u-tokyo.ac.jp",
      ranking: 28,
      acceptanceRate: 35,
    },
    {
      name: "Sciences Po Paris",
      country: "France",
      city: "Paris",
      programs: ["Political Science", "Law", "International Affairs", "Economics", "Sociology"],
      tuitionMin: 4000,
      tuitionMax: 15000,
      scholarshipAvailable: true,
      description:
        "A world-renowned university for political science and international affairs. Sciences Po has educated five French presidents and numerous world leaders.",
      website: "https://www.sciencespo.fr",
      ranking: 244,
      acceptanceRate: 20,
    },
    {
      name: "ETH Zurich",
      country: "Switzerland",
      city: "Zurich",
      programs: ["Engineering", "Natural Sciences", "Architecture", "Mathematics", "Computer Science"],
      tuitionMin: 1500,
      tuitionMax: 2500,
      scholarshipAvailable: false,
      description:
        "One of the world's leading universities in science and technology, ETH Zurich has produced 21 Nobel Prize winners, including Albert Einstein. Low tuition and exceptional research opportunities.",
      website: "https://www.ethz.ch",
      ranking: 7,
      acceptanceRate: 27,
      featured: true,
    },
    {
      name: "University of Edinburgh",
      country: "United Kingdom",
      city: "Edinburgh",
      programs: ["Medicine", "Arts", "Science & Engineering", "Social Sciences", "Law"],
      tuitionMin: 20000,
      tuitionMax: 32000,
      scholarshipAvailable: true,
      description:
        "One of the world's great universities with over 450 years of history. The University of Edinburgh is a member of the prestigious Russell Group with a strong reputation for research.",
      website: "https://www.ed.ac.uk",
      ranking: 22,
      acceptanceRate: 55,
    },
    {
      name: "Maastricht University",
      country: "Netherlands",
      city: "Maastricht",
      programs: ["Business", "Law", "Medicine", "Psychology", "Arts & Social Sciences"],
      tuitionMin: 2200,
      tuitionMax: 14000,
      scholarshipAvailable: true,
      description:
        "Known for its problem-based learning approach, Maastricht University is one of the most international universities in Europe with students from 100+ countries.",
      website: "https://www.maastrichtuniversity.nl",
      ranking: 270,
      acceptanceRate: 60,
    },
    {
      name: "University of Auckland",
      country: "New Zealand",
      city: "Auckland",
      programs: ["Engineering", "Business", "Arts", "Science", "Law"],
      tuitionMin: 22000,
      tuitionMax: 38000,
      scholarshipAvailable: true,
      description:
        "New Zealand's largest and leading university, consistently ranked in the world's top 100. Located in Auckland, the Pacific gateway city, it offers a welcoming environment for international students.",
      website: "https://www.auckland.ac.nz",
      ranking: 87,
      acceptanceRate: 72,
    },
    {
      name: "University of Nairobi",
      country: "Kenya",
      city: "Nairobi",
      programs: ["Medicine", "Engineering", "Law", "Business", "Agriculture"],
      tuitionMin: 1000,
      tuitionMax: 5000,
      scholarshipAvailable: false,
      description:
        "Kenya's oldest and largest university, founded in 1956. Recognised as a Centre of Excellence in East Africa and home to various research institutes addressing regional challenges.",
      website: "https://www.uonbi.ac.ke",
      ranking: 901,
      acceptanceRate: 25,
    },
    {
      name: "Waseda University",
      country: "Japan",
      city: "Tokyo",
      programs: ["Business", "Political Science", "Engineering", "Arts", "Sciences"],
      tuitionMin: 5000,
      tuitionMax: 10000,
      scholarshipAvailable: true,
      description:
        "One of Japan's most prestigious private universities, Waseda is known for its liberal education tradition and international outlook. Offers a growing number of English-taught programmes.",
      website: "https://www.waseda.jp",
      ranking: 199,
      acceptanceRate: 40,
    },
  ];

  for (const college of colleges) {
    await prisma.college.upsert({
      where: { name: college.name } as never,
      update: {},
      create: college,
    });
  }

  console.log(`✅ ${colleges.length} colleges seeded`);

  // ─── Scholarships ─────────────────────────────────────────────────────────────
  const scholarships = [
    {
      name: "Chevening Scholarship",
      amount: 45000,
      currency: "GBP",
      deadline: new Date("2024-11-01"),
      eligibility:
        "Open to outstanding professionals from Chevening-eligible countries. Must have at least 2 years of work experience and an undergraduate degree.",
      country: "United Kingdom",
      description:
        "The Chevening Scholarship is the UK government's international award scheme, enabling outstanding emerging leaders from around the world to pursue a one-year master's degree at any UK university.",
      provider: "UK Government (FCDO)",
      website: "https://www.chevening.org",
    },
    {
      name: "Commonwealth Scholarship",
      amount: 30000,
      currency: "GBP",
      deadline: new Date("2024-12-15"),
      eligibility:
        "Citizens of Commonwealth countries applying for postgraduate study. Must demonstrate strong academic record and potential for leadership.",
      country: null,
      description:
        "Commonwealth Scholarships are offered to citizens of Commonwealth countries for postgraduate study in the UK, aimed at those who could not otherwise afford to study in the UK.",
      provider: "Commonwealth Scholarship Commission",
      website: "https://www.cscuk.fcdo.gov.uk",
    },
    {
      name: "DAAD Scholarship Germany",
      amount: 12000,
      currency: "EUR",
      deadline: new Date("2024-10-15"),
      eligibility:
        "Open to highly qualified graduates or doctoral students from developing countries. Relevant professional experience preferred.",
      country: "Germany",
      description:
        "The German Academic Exchange Service (DAAD) offers scholarships to international students wanting to pursue postgraduate studies in Germany, covering tuition and living expenses.",
      provider: "DAAD (German Academic Exchange Service)",
      website: "https://www.daad.de",
    },
    {
      name: "Australia Awards Scholarship",
      amount: 50000,
      currency: "AUD",
      deadline: new Date("2024-04-30"),
      eligibility:
        "Open to citizens of eligible developing countries in the Indo-Pacific region. Must not have previously received an Australian Government scholarship.",
      country: "Australia",
      description:
        "Australia Awards Scholarships provide opportunities for people from developing countries in the Indo-Pacific to undertake full-time undergraduate or postgraduate study at Australian institutions.",
      provider: "Australian Government (DFAT)",
      website: "https://www.australiaawards.gov.au",
    },
    {
      name: "MasterCard Foundation Scholars Program",
      amount: 40000,
      currency: "USD",
      deadline: new Date("2025-01-31"),
      eligibility:
        "African students demonstrating exceptional academic talent and leadership potential. Must demonstrate financial need and commitment to giving back to communities.",
      country: null,
      description:
        "The MasterCard Foundation Scholars Program enables academically talented, yet financially disadvantaged young Africans to access quality higher education and leadership opportunities.",
      provider: "MasterCard Foundation",
      website: "https://mastercardfdn.org",
    },
    {
      name: "Erasmus+ Programme",
      amount: 8000,
      currency: "EUR",
      deadline: new Date("2025-02-01"),
      eligibility:
        "Available to students enrolled at an Erasmus+ partner university. Must meet minimum language requirements for the destination country.",
      country: null,
      description:
        "Erasmus+ supports the mobility of students, staff, and researchers across Europe and beyond, providing grants for studying or training abroad for periods of 3 to 12 months.",
      provider: "European Commission",
      website: "https://erasmus-plus.ec.europa.eu",
    },
    {
      name: "Aga Khan Foundation Scholarship",
      amount: 25000,
      currency: "USD",
      deadline: new Date("2025-03-31"),
      eligibility:
        "Exceptional students from select developing countries who have no other means of financing their studies. Must demonstrate academic excellence and financial need.",
      country: null,
      description:
        "The Aga Khan Foundation provides a limited number of scholarships each year for postgraduate studies to outstanding students from developing countries who have no other means of financing their studies.",
      provider: "Aga Khan Foundation",
      website: "https://www.akdn.org",
    },
    {
      name: "Apple 9 Merit Bursary",
      amount: 2000,
      currency: "USD",
      deadline: new Date("2025-06-30"),
      eligibility:
        "Any student registered on the Apple 9 platform who has applied to at least one college. Must submit a personal statement and demonstrate financial need.",
      country: null,
      description:
        "Apple 9's own mid-semester bursary program designed to help students cover application fees, travel, and initial living costs. Awarded quarterly to deserving applicants.",
      provider: "Apple 9",
      website: null,
    },
  ];

  for (const scholarship of scholarships) {
    await prisma.scholarshipProgram.upsert({
      where: { name: scholarship.name } as never,
      update: {},
      create: scholarship,
    });
  }

  console.log(`✅ ${scholarships.length} scholarships seeded`);

  // ─── Sample partnerships ─────────────────────────────────────────────────────
  const partnerships = [
    { name: "Emirates Airlines", type: "AIRLINE" as const, website: "https://emirates.com", contactEmail: "partners@emirates.com" },
    { name: "British Council", type: "SPONSOR" as const, website: "https://britishcouncil.org", contactEmail: "partnerships@britishcouncil.org" },
    { name: "IDP Education", type: "SPONSOR" as const, website: "https://www.idp.com", contactEmail: null },
  ];

  for (const p of partnerships) {
    const exists = await prisma.partnership.findFirst({ where: { name: p.name } });
    if (!exists) await prisma.partnership.create({ data: p });
  }

  console.log("✅ Partnerships seeded");

  console.log("\n🎉 Seeding complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Demo accounts:");
  console.log("  Admin:   admin@apple9.com    / admin123456");
  console.log("  Media:   media@apple9.com    / media123456");
  console.log("  Student: student@example.com / student123456");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
