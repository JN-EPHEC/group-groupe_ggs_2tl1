import { config } from "dotenv";
import pg from "pg";

config({ path: process.env.DOTENV_CONFIG_PATH || ".env.production" });

const sql = `
BEGIN;

DO $$
BEGIN
  IF to_regclass('"Category"') IS NOT NULL AND to_regclass('"Categories"') IS NULL THEN
    ALTER TABLE "Category" RENAME TO "Categories";
  END IF;

  IF to_regclass('"Product"') IS NOT NULL AND to_regclass('"Products"') IS NULL THEN
    ALTER TABLE "Product" RENAME TO "Products";
  END IF;

  IF to_regclass('"Credential"') IS NOT NULL AND to_regclass('"Credentials"') IS NULL THEN
    ALTER TABLE "Credential" RENAME TO "Credentials";
  END IF;

  IF to_regclass('"Order"') IS NOT NULL AND to_regclass('"Orders"') IS NULL THEN
    ALTER TABLE "Order" RENAME TO "Orders";
  END IF;

  IF to_regclass('"Permission"') IS NOT NULL AND to_regclass('"Permissions"') IS NULL THEN
    ALTER TABLE "Permission" RENAME TO "Permissions";
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'createdAt') THEN
    ALTER TABLE "User" RENAME COLUMN "createdAt" TO "created_at";
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Address' AND column_name = 'userId') THEN
    ALTER TABLE "Address" RENAME COLUMN "userId" TO "user_id";
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Credentials' AND column_name = 'userId') THEN
    ALTER TABLE "Credentials" RENAME COLUMN "userId" TO "user_id";
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Credentials' AND column_name = 'passwordHash') THEN
    ALTER TABLE "Credentials" RENAME COLUMN "passwordHash" TO "password_hash";
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Products' AND column_name = 'categoryId') THEN
    ALTER TABLE "Products" RENAME COLUMN "categoryId" TO "category_id";
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Orders' AND column_name = 'userId') THEN
    ALTER TABLE "Orders" RENAME COLUMN "userId" TO "user_id";
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'OrderProduct' AND column_name = 'orderId') THEN
    ALTER TABLE "OrderProduct" RENAME COLUMN "orderId" TO "order_id";
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'OrderProduct' AND column_name = 'productId') THEN
    ALTER TABLE "OrderProduct" RENAME COLUMN "productId" TO "product_id";
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'UserRole' AND column_name = 'userId') THEN
    ALTER TABLE "UserRole" RENAME COLUMN "userId" TO "user_id";
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'UserRole' AND column_name = 'roleId') THEN
    ALTER TABLE "UserRole" RENAME COLUMN "roleId" TO "role_id";
  END IF;
END $$;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Products" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "Products" ALTER COLUMN "price" TYPE DOUBLE PRECISION USING "price"::DOUBLE PRECISION;
ALTER TABLE "OrderProduct" ALTER COLUMN "priceAtPurchase" TYPE DOUBLE PRECISION USING "priceAtPurchase"::DOUBLE PRECISION;

CREATE TABLE IF NOT EXISTS "OrderStatus" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE
);

INSERT INTO "OrderStatus" ("name")
VALUES ('En attente'), ('Validee'), ('Expediee'), ('Livree'), ('Annulee')
ON CONFLICT ("name") DO NOTHING;

ALTER TABLE "Orders" ADD COLUMN IF NOT EXISTS "status_id" INTEGER;

UPDATE "Orders"
SET "status_id" = COALESCE(
  (
    SELECT "id"
    FROM "OrderStatus"
    WHERE lower("OrderStatus"."name") = lower(COALESCE("Orders"."status", 'En attente'))
    LIMIT 1
  ),
  (SELECT "id" FROM "OrderStatus" WHERE "name" = 'En attente' LIMIT 1)
)
WHERE "status_id" IS NULL;

ALTER TABLE "Orders" ALTER COLUMN "status_id" SET NOT NULL;
ALTER TABLE "Orders" DROP COLUMN IF EXISTS "status";

CREATE TABLE IF NOT EXISTS "OrderStatusHistory" (
  "id" SERIAL PRIMARY KEY,
  "order_id" INTEGER NOT NULL,
  "from_status" TEXT,
  "to_status" TEXT NOT NULL,
  "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "RolePermission" (
  "role_id" INTEGER NOT NULL,
  "permission_id" INTEGER NOT NULL,
  CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("role_id", "permission_id")
);

INSERT INTO "RolePermission" ("role_id", "permission_id")
SELECT "roleId", "id"
FROM "Permissions"
WHERE EXISTS (
  SELECT 1 FROM information_schema.columns WHERE table_name = 'Permissions' AND column_name = 'roleId'
)
ON CONFLICT DO NOTHING;

ALTER TABLE "Permissions" DROP COLUMN IF EXISTS "roleId";

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User" ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Credentials_user_id_key" ON "Credentials" ("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "Categories_name_key" ON "Categories" ("name");
CREATE UNIQUE INDEX IF NOT EXISTS "Role_name_key" ON "Role" ("name");
CREATE UNIQUE INDEX IF NOT EXISTS "Permissions_name_key" ON "Permissions" ("name");
CREATE UNIQUE INDEX IF NOT EXISTS "OrderStatus_name_key" ON "OrderStatus" ("name");

COMMIT;
`;

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL manquant");
  }

  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  await client.query(sql);
  await client.end();

  console.log("Schema production adapte au modele courant.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
