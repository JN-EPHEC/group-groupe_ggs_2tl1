import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '@prisma/client'

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
    // Table Role
    const roleClient = await prisma.role.upsert({
        where: { name: "Client" },
        update: {},
        create: { name: "Client" },
    });

    const roleAdmin = await prisma.role.upsert({
        where: { name: "Admin" },
        update: {},
        create: { name: "Admin" },
    });

    const roleVendor = await prisma.role.upsert({
        where: { name: "Vendor" },
        update: {},
        create: { name: "Vendor" },
    });

    //Table Permssions
    const permRead = await prisma.permissions.upsert({
        where: { name: "READ" },
        update: {},
        create: { name: "READ" },
    });
    const permDelete = await prisma.permissions.upsert({
        where: { name: "DELETE" },
        update: {},
        create: { name: "DELETE" },
    });
    const permWrite = await prisma.permissions.upsert({
        where: { name: "WRITE" },
        update: {},
        create: { name: "WRITE" },
    });

    //Table Status
    const statusPending = await prisma.orderStatus.upsert({
        where: { name: "En attente" },
        update: {},
        create: { name: "En attente" },
    });

    //Table Categories
    const catPants = await prisma.categories.upsert({
        where: { name: "Pants"},
        update: {},
        create: { name: "Pants"}
    });
    const catShirt = await prisma.categories.upsert({
        where: { name: "Shirts"},
        update: {},
        create: { name: "Shirts"}
    });
    const catTop = await prisma.categories.upsert({
        where: { name: "Top"},
        update: {},
        create: { name: "Top"}
    });

    //Table des produits
        const prodJeans = await prisma.products.create({
        data: {
        name: "Jeans",
        description: "Blue jeans",
        price: 50,
        stock: 20,
        category: {
          connect: { id: catPants.id }
        }
      }
    });

    const prodTshirt = await prisma.products.create({
      data: {
        name: "T-Shirt",
        description: "Basic white t-shirt",
        price: 20,
        stock: 50,
        category: {
          connect: { id: catShirt.id }
        }
      }
    });

    const prodJacket = await prisma.products.create({
      data: {
        name: "Jacket",
        description: "Winter jacket",
        price: 100,
        stock: 10,
        category: {
          connect: { id: catTop.id }
        }
      }
    });
    

    //Table User
    const alice = await prisma.user.upsert({
        where: { email: "alice@test.com" },
        update: {},
        create: {
            email: "alice@test.com",
            username: "Alice",
            credentials: {
                create: {
                    password_hash: "hash123",
                    salt: "salt123",
                },
            },
            addresses: {
                create: {
                    street: "Rue A",
                    city: "Bruxelles",
                    state: "Bruxelles",
                    postalCode: "1000",
                    country: "Belgique",
                },
            },
            orders: {
                create: {
                    orderDate: new Date(),
                    status: {
                        connect: { id: statusPending.id }
                    }
                },
            },
        },
        include: {
          orders: true
        }
    });
    const bob = await prisma.user.upsert({
        where: { email: "bob@test.com" },
        update: {},
        create: {
            email: "bob@test.com",
            username: "Bob",
            credentials: {
                create: {
                    password_hash: "hash12356",
                    salt: "salt1236789",
                },
            },
            addresses: {
                create: {
                    street: "Rue B",
                    city: "Ottignes",
                    state: "BW",
                    postalCode: "1310",
                    country: "Belgique",
                },
            },
            orders: {
                create: {
                    orderDate: new Date(),
                    status: {
                        connect: { id: statusPending.id }
                    }
                },
            },
        },
        include: {
          orders: true
        }
    });
    console.log({ alice, bob });

    // Table UserRole
    await prisma.userRole.create({
        data: {
            user_id: alice.id,
            role_id: roleClient.id,
        },
    });

    await prisma.userRole.create({
        data: {
            user_id: bob.id,
            role_id: roleAdmin.id,
        },
    });

    // Table RolePermission
    await prisma.rolePermission.create({
        data: {
            role_id: roleAdmin.id,
            permission_id: permRead.id,
        },
    });

    await prisma.rolePermission.create({
        data: {
            role_id: roleAdmin.id,
            permission_id: permWrite.id,
        },
    });

    await prisma.rolePermission.create({
        data: {
            role_id: roleAdmin.id,
            permission_id: permDelete.id,
        },
    });

    //table OrderProduct
    await prisma.orderProduct.create({
        data: {
            order_id: alice.orders[0].id,
            product_id: prodJeans.id,
            quantity: 2,
            priceAtPurchase: 50,
        },
    });

    await prisma.orderProduct.create({
        data: {
            order_id: bob.orders[0].id,
            product_id: prodJacket.id,
            quantity: 1,
            priceAtPurchase: 100,
        },
    });

    await prisma.orderProduct.create({
        data: {
            order_id: alice.orders[0].id,
            product_id: prodTshirt.id,
            quantity: 3,
            priceAtPurchase: 20,
        },
    });
}
main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });