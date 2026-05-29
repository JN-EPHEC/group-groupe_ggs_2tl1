import "dotenv/config";
import { registerUser } from "../server/src/services/authService.ts";
import prisma from "../server/src/config/prisma.ts";

const ADMIN_EMAIL = "admin.dev@test.com";
const ADMIN_USERNAME = "AdminDev";
const ADMIN_PASSWORD = "Admin123!";

async function ensureAdminRole(userId) {
  const adminRole = await prisma.role.findUnique({ where: { name: "Admin" } });
  if (!adminRole) {
    throw new Error("Rôle Admin introuvable en base");
  }

  await prisma.userRole.upsert({
    where: {
      user_id_role_id: {
        user_id: userId,
        role_id: adminRole.id,
      },
    },
    update: {},
    create: {
      user_id: userId,
      role_id: adminRole.id,
    },
  });
}

async function main() {
  let userId;

  try {
    const result = await registerUser({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    userId = result.user.id;
    console.log("Compte créé via inscription.");
  } catch (error) {
    if (!(error instanceof Error) || error.message !== "EMAIL_ALREADY_EXISTS") {
      throw error;
    }

    const existing = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
      select: { id: true },
    });

    if (!existing) {
      throw new Error("Email déjà utilisé mais utilisateur introuvable");
    }

    userId = existing.id;
    console.log("Compte existant trouvé, promotion en admin.");
  }

  await ensureAdminRole(userId);

  console.log(
    JSON.stringify(
      {
        id: userId,
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
        role: "Admin",
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
