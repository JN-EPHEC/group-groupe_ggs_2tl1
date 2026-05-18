import type { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 12;
const ALLOWED_SORT_VALUES = ["prix_asc", "prix_desc", "nom_asc", "nom_desc"] as const;

type SortValue = (typeof ALLOWED_SORT_VALUES)[number];

type ProductQueryInput = {
  page?: unknown;
  limit?: unknown;
  categorie_id?: unknown;
  prix_min?: unknown;
  prix_max?: unknown;
  sort?: unknown;
};

const parsePositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

const formatProduct = (product: {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  category: { name: string };
}) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  stock: product.stock,
  category: product.category.name,
  category_id: product.category_id,
});

export const getProductsCatalog = async (query: ProductQueryInput) => {
  const page = parsePositiveInt(query.page, DEFAULT_PAGE);
  const requestedLimit = parsePositiveInt(query.limit, DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const skip = (page - 1) * limit;
  const categoryId = parsePositiveInt(query.categorie_id, 0);
  const minPrice = Number(query.prix_min);
  const maxPrice = Number(query.prix_max);
  const sort = query.sort;

  if (Number.isFinite(minPrice) && minPrice < 0) {
    throw new Error("MIN_PRICE_INVALID");
  }

  if (Number.isFinite(maxPrice) && maxPrice < 0) {
    throw new Error("MAX_PRICE_INVALID");
  }

  if (Number.isFinite(minPrice) && Number.isFinite(maxPrice) && maxPrice < minPrice) {
    throw new Error("PRICE_RANGE_INVALID");
  }

  if (typeof sort === "string" && !ALLOWED_SORT_VALUES.includes(sort as SortValue)) {
    throw new Error("SORT_INVALID");
  }

  const where: Prisma.ProductsWhereInput = {};

  if (categoryId > 0) {
    where.category_id = categoryId;
  }

  if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
    where.price = {};

    if (Number.isFinite(minPrice)) {
      where.price.gte = minPrice;
    }

    if (Number.isFinite(maxPrice)) {
      where.price.lte = maxPrice;
    }
  }

  let orderBy: Prisma.ProductsOrderByWithRelationInput = { id: "asc" };

  if (sort === "prix_asc") {
    orderBy = { price: "asc" };
  } else if (sort === "prix_desc") {
    orderBy = { price: "desc" };
  } else if (sort === "nom_asc") {
    orderBy = { name: "asc" };
  } else if (sort === "nom_desc") {
    orderBy = { name: "desc" };
  }

  const products = await prisma.products.findMany({
    where,
    skip,
    take: limit,
    orderBy,
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return products.map(formatProduct);
};

export const getCatalogProductById = async (id: number) => {
  const product = await prisma.products.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  return formatProduct(product);
};
