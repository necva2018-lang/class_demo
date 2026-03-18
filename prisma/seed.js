/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");
const banners = require("../src/data/banners.json");
const courses = require("../src/data/courses.json");
const categories = require("../src/data/categories.json");

const prisma = new PrismaClient();

function normalize(raw) {
  return {
    title: raw.title ?? "",
    subtitle: raw.subtitle ?? "",
    backgroundImage: raw.backgroundImage ?? "",
    primaryCtaLabel:
      raw.primaryCta?.label ?? raw.primaryCtaLabel ?? "立即找課程",
    primaryCtaHref: raw.primaryCta?.href ?? raw.primaryCtaHref ?? "/courses",
    secondaryCtaLabel:
      raw.secondaryCta?.label ?? raw.secondaryCtaLabel ?? "",
    secondaryCtaHref:
      raw.secondaryCta?.href ?? raw.secondaryCtaHref ?? "",
    order: Number(raw.order ?? 0),
    active: Boolean(raw.active),
    isDefault: Boolean(raw.isDefault),
  };
}

async function main() {
  const count = await prisma.banner.count();
  if (count > 0) {
    console.log("Seed skipped: banners already exist.");
    return;
  }
  const rows = Array.isArray(banners) ? banners.map(normalize) : [];
  if (rows.length === 0) {
    console.log("Seed skipped: no default banners.");
    return;
  }
  await prisma.banner.createMany({ data: rows });
  const defaultRow = rows.find((b) => b.isDefault);
  if (defaultRow) {
    const created = await prisma.banner.findFirst({
      where: { title: defaultRow.title },
      orderBy: { createdAt: "asc" },
    });
    if (created) {
      await prisma.banner.updateMany({
        where: { NOT: { id: created.id } },
        data: { isDefault: false },
      });
    }
  }
  console.log(`Seeded ${rows.length} banners.`);

  // 若 AppConfig 尚無 courses/categories，用 JSON 初始值寫入，確保前後台資料一致
  const coursesRow = await prisma.appConfig.findUnique({ where: { key: "courses" } });
  if (!coursesRow && Array.isArray(courses)) {
    await prisma.appConfig.create({
      data: { key: "courses", value: courses },
    });
    console.log(`Seeded ${courses.length} courses to AppConfig.`);
  }

  const categoriesRow = await prisma.appConfig.findUnique({ where: { key: "categories" } });
  if (!categoriesRow && Array.isArray(categories)) {
    await prisma.appConfig.create({
      data: { key: "categories", value: categories },
    });
    console.log(`Seeded ${categories.length} categories to AppConfig.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

