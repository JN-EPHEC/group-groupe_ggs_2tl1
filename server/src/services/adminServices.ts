import prisma from "../config/prisma.js";
import { ROLE_ADMIN } from "../utils/roles.js";

type ProductInput = {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category_id?: number;
};

type UserUpdateInput = {
  username?: string;
  email?: string;
  isActive?: boolean;
};

type AdminInput = {
  username: string;
  email: string;
  [key: string]: unknown;
};

const userSelect = {
  id: true,
  username: true,
  email: true,
  created_at: true,
  isActive: true,
  roles: {
    select: {
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};

export const createProductAdmin = async (input: ProductInput) => {
  return prisma.products.create({
    data: input as Required<ProductInput>,
  });
};

const productAdminDetailSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  stock: true,
  category_id: true,
  isActive: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const parseProductUpdateInput = (input: ProductInput) => {
  const data: ProductInput = {};

  if (input.name !== undefined) {
    const name = String(input.name).trim();
    if (!name || name.length > 255) {
      throw new Error("INVALID_PRODUCT_NAME");
    }
    data.name = name;
  }

  if (input.description !== undefined) {
    const description = String(input.description).trim();
    if (description.length > 2000) {
      throw new Error("INVALID_PRODUCT_DESCRIPTION");
    }
    data.description = description;
  }

  if (input.price !== undefined) {
    const price = Number(input.price);
    if (!Number.isFinite(price) || price < 0) {
      throw new Error("INVALID_PRODUCT_PRICE");
    }
    data.price = price;
  }

  if (input.stock !== undefined) {
    const stock = Number(input.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      throw new Error("INVALID_STOCK");
    }
    data.stock = stock;
  }

  if (input.category_id !== undefined) {
    const categoryId = Number(input.category_id);
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      throw new Error("INVALID_PRODUCT_CATEGORY");
    }
    data.category_id = categoryId;
  }

  if (Object.keys(data).length === 0) {
    throw new Error("NO_PRODUCT_DATA");
  }

  return data;
};

export const getProductAdmin = async (productId: number) => {
  const product = await prisma.products.findUnique({
    where: { id: productId },
    select: productAdminDetailSelect,
  });

  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  return product;
};

export const updateProductAdmin = async (productId: number, input: ProductInput) => {
  const exists = await prisma.products.findUnique({ where: { id: productId } });

  if (!exists) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  const data = parseProductUpdateInput(input);

  if (data.category_id !== undefined) {
    const category = await prisma.categories.findUnique({
      where: { id: data.category_id },
    });
    if (!category) {
      throw new Error("CATEGORY_NOT_FOUND");
    }
  }

  return prisma.products.update({
    where: { id: productId },
    data,
    select: productAdminDetailSelect,
  });
};

export const deleteProductAdmin = async (productId: number) => {
  const product = await prisma.products.findUnique({
    where: { id: productId },
    include: {
      _count: {
        select: { orderProducts: true },
      },
    },
  });

  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  if (product._count.orderProducts > 0) {
    const deactivated = await prisma.products.update({
      where: { id: productId },
      data: { isActive: false },
      select: productAdminDetailSelect,
    });

    return { mode: "soft" as const, product: deactivated };
  }

  const deleted = await prisma.products.delete({
    where: { id: productId },
    select: productAdminDetailSelect,
  });

  return { mode: "hard" as const, product: deleted };
};

type ListProductsInput = {
  sort?: string;
};

const productListSelect = {
  id: true,
  name: true,
  stock: true,
  price: true,
  isActive: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const listProductsAdmin = async (input: ListProductsInput = {}) => {
  const orderBy =
    input.sort === "stock_desc"
      ? { stock: "desc" as const }
      : { stock: "asc" as const };

  return prisma.products.findMany({
    select: productListSelect,
    orderBy,
  });
};

export const updateProductStockAdmin = async (productId: number, quantite: unknown) => {
  const parsed = Number(quantite);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error("INVALID_STOCK");
  }

  const exists = await prisma.products.findUnique({ where: { id: productId } });

  if (!exists) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  return prisma.products.update({
    where: { id: productId },
    data: { stock: parsed },
    select: productListSelect,
  });
};

const USERS_PAGE_SIZE = 20;

type ListUsersInput = {
  search?: string;
  page?: number;
};

const orderInclude = {
  orderBy: { orderDate: "desc" as const },
  include: {
    status: true,
    orderProducts: {
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  },
};

export const listUsersAdmin = async (input: ListUsersInput = {}) => {
  const page = Number.isInteger(input.page) && (input.page as number) > 0 ? (input.page as number) : 1;
  const search = input.search?.trim();

  const where =
    search && search.length > 0
      ? {
          OR: [
            { username: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : undefined;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: userSelect,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * USERS_PAGE_SIZE,
      take: USERS_PAGE_SIZE,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      pageSize: USERS_PAGE_SIZE,
      total,
      totalPages: Math.max(1, Math.ceil(total / USERS_PAGE_SIZE)),
    },
  };
};

export const getUserAdmin = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...userSelect,
      orders: orderInclude,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};

export const updateUserAdmin = async (userId: number, input: UserUpdateInput) => {
  const exists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!exists) {
    throw new Error("USER_NOT_FOUND");
  }

  const data: UserUpdateInput = {};

  if (input.username !== undefined) data.username = input.username;
  if (input.email !== undefined) data.email = input.email;
  if (input.isActive !== undefined) data.isActive = input.isActive;

  if (Object.keys(data).length === 0) {
    throw new Error("NO_USER_DATA");
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: userSelect,
  });
};

export const createAdminUser = async (input: AdminInput) => {
  const adminRole = await prisma.role.findUnique({
    where: { name: ROLE_ADMIN },
  });

  if (!adminRole) {
    throw new Error("ADMIN_ROLE_NOT_FOUND");
  }

  return prisma.user.create({
    data: {
      ...input,
      roles: {
        create: {
          role_id: adminRole.id,
        },
      },
    },
    select: userSelect,
  });
};

const ANONYMIZED_EMAIL_SUFFIX = "@anonymized.local";

export const anonymizeUserAdmin = async (targetUserId: number, adminUserId: number) => {
  if (targetUserId === adminUserId) {
    throw new Error("CANNOT_DELETE_SELF");
  }

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.email.endsWith(ANONYMIZED_EMAIL_SUFFIX)) {
    throw new Error("USER_ALREADY_ANONYMIZED");
  }

  const anonymizedUser = await prisma.$transaction(async (tx) => {
    await tx.credentials.deleteMany({ where: { user_id: targetUserId } });
    await tx.address.deleteMany({ where: { user_id: targetUserId } });
    await tx.userRole.deleteMany({ where: { user_id: targetUserId } });

    return tx.user.update({
      where: { id: targetUserId },
      data: {
        username: `utilisateur_supprime_${targetUserId}`,
        email: `deleted_${targetUserId}${ANONYMIZED_EMAIL_SUFFIX}`,
        isActive: false,
      },
      select: userSelect,
    });
  });

  return {
    message: "Utilisateur anonymisé",
    user: anonymizedUser,
  };
};

