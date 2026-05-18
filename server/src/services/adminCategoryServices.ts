import prisma from "../config/prisma.js";

type CategoryInput = {
  name: string;
};

export const getAllCategoriesAdmin = async () => {
  return prisma.categories.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
};

export const createCategoryAdmin = async (input: CategoryInput) => {
  const name = input.name?.trim();

  if (!name || name.length > 100) {
    throw new Error("INVALID_CATEGORY_NAME");
  }

  try {
    return await prisma.categories.create({
      data: { name },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  } catch {
    throw new Error("CATEGORY_NAME_EXISTS");
  }
};

export const updateCategoryAdmin = async (categoryId: number, input: CategoryInput) => {
  const name = input.name?.trim();

  if (!name || name.length > 100) {
    throw new Error("INVALID_CATEGORY_NAME");
  }

  const exists = await prisma.categories.findUnique({
    where: { id: categoryId },
  });

  if (!exists) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  try {
    return await prisma.categories.update({
      where: { id: categoryId },
      data: { name },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  } catch {
    throw new Error("CATEGORY_NAME_EXISTS");
  }
};

export const deleteCategoryAdmin = async (categoryId: number) => {
  const category = await prisma.categories.findUnique({
    where: { id: categoryId },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  if (category._count.products > 0) {
    throw new Error("CATEGORY_HAS_PRODUCTS");
  }

  return prisma.categories.delete({
    where: { id: categoryId },
  });
};
