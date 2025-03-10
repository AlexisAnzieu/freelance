import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedCompanyTypes() {
  try {
    const types = await prisma.companyType.createMany({
      data: [{ name: "contractor" }, { name: "customer" }],
      skipDuplicates: true,
    });
    console.log(`✅ Successfully created ${types.count} company types`);
    return types;
  } catch (error) {
    console.error("❌ Error seeding company types:", error);
    throw error;
  }
}

async function main() {
  console.log("🌱 Starting database seed...");
  await seedCompanyTypes();
  console.log("✅ Seed completed successfully");
}

main()
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
