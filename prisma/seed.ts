import "dotenv/config";
import { ORDER_STATUS_NAMES } from "../server/src/constants/orderStatuses.js";
import prisma from "../server/src/config/prisma";

async function upsertUserRole(userId: number, roleId: number) {
    await prisma.userRole.upsert({
        where: {
            user_id_role_id: {
                user_id: userId,
                role_id: roleId,
            },
        },
        update: {},
        create: {
            user_id: userId,
            role_id: roleId,
        },
    });
}

async function upsertRolePermission(roleId: number, permissionId: number) {
    await prisma.rolePermission.upsert({
        where: {
            role_id_permission_id: {
                role_id: roleId,
                permission_id: permissionId,
            },
        },
        update: {},
        create: {
            role_id: roleId,
            permission_id: permissionId,
        },
    });
}

async function ensureProduct(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: number;
}) {
    const existing = await prisma.products.findFirst({
        where: { name: data.name },
    });

    if (existing) {
        return existing;
    }

    return prisma.products.create({ data });
}

async function ensureOrderProduct(data: {
    order_id: number;
    product_id: number;
    quantity: number;
    priceAtPurchase: number;
}) {
    const existing = await prisma.orderProduct.findFirst({
        where: {
            order_id: data.order_id,
            product_id: data.product_id,
        },
    });

    if (existing) {
        return existing;
    }

    return prisma.orderProduct.create({ data });
}

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

    // Table OrderStatus
    const statuses: Record<string, { id: number; name: string }> = {};

    for (const name of ORDER_STATUS_NAMES) {
        const status = await prisma.orderStatus.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        statuses[name] = status;
    }

    const statusPending = statuses["En attente"];

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
    const prodJeans = await ensureProduct({
        name: "Jeans",
        description: "Blue jeans",
        price: 50,
        stock: 20,
        category_id: catPants.id,
    });

    const prodTshirt = await ensureProduct({
        name: "T-Shirt",
        description: "Basic white t-shirt",
        price: 20,
        stock: 50,
        category_id: catShirt.id,
    });

    const prodJacket = await ensureProduct({
        name: "Jacket",
        description: "Winter jacket",
        price: 100,
        stock: 10,
        category_id: catTop.id,
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
    await upsertUserRole(alice.id, roleClient.id);
    await upsertUserRole(bob.id, roleAdmin.id);

    // Table RolePermission
    await upsertRolePermission(roleAdmin.id, permRead.id);
    await upsertRolePermission(roleAdmin.id, permWrite.id);
    await upsertRolePermission(roleAdmin.id, permDelete.id);

    //table OrderProduct
    if (alice.orders[0]) {
        await ensureOrderProduct({
            order_id: alice.orders[0].id,
            product_id: prodJeans.id,
            quantity: 2,
            priceAtPurchase: 50,
        });
        await ensureOrderProduct({
            order_id: alice.orders[0].id,
            product_id: prodTshirt.id,
            quantity: 3,
            priceAtPurchase: 20,
        });
    }

    if (bob.orders[0]) {
        await ensureOrderProduct({
            order_id: bob.orders[0].id,
            product_id: prodJacket.id,
            quantity: 1,
            priceAtPurchase: 100,
        });
    }
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
