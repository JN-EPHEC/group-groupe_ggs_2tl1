import axios from "axios";
import type { Product } from "../types/product";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

interface RawProduct {
  id?: number | string;
  productId?: number | string;
  name?: string;
  title?: string;
  price?: number | string;
  category?: string;
  categoryName?: string;
  image?: string;
  imageUrl?: string;
  stock?: number | string;
  quantity?: number | string;
  description?: string;
  category_id?: number | string;
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function normalizeProduct(raw: RawProduct, index: number): Product {
  return {
    id: raw.id ?? raw.productId ?? index,
    name: raw.name ?? raw.title ?? "Produit sans nom",
    price: toNumber(raw.price),
    description: raw.description,
    category: raw.category ?? raw.categoryName ?? "Non classé",
    category_id: toNumber(raw.category_id, 0),
    image: raw.image ?? raw.imageUrl,
    stock: toNumber(raw.stock ?? raw.quantity, 0),
  };
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  categorie_id?: number;
  prix_min?: number;
  prix_max?: number;
  sort?: "prix_asc" | "prix_desc" | "nom_asc" | "nom_desc";
}

export async function getProducts(params: GetProductsParams = {}): Promise<Product[]> {
  const response = await apiClient.get<RawProduct[]>("/api/produits", {
    params,
  });
  return response.data.map((product, index) => normalizeProduct(product, index));
}

export async function getProductById(id: number | string): Promise<Product> {
  const response = await apiClient.get<RawProduct>(`/api/produits/${id}`);
  return normalizeProduct(response.data, 0);
}

