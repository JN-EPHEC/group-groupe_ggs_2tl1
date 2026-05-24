import axios from "axios";
import type { Category } from "../types/category";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

interface RawCategory {
  id?: number | string;
  name?: string;
}

function normalizeCategory(raw: RawCategory, index: number): Category {
  const id = Number(raw.id);
  return {
    id: Number.isInteger(id) && id > 0 ? id : index + 1,
    name: raw.name?.trim() || "Catégorie sans nom",
  };
}

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<RawCategory[]>("/api/categories");
  return response.data.map((category, index) => normalizeCategory(category, index));
}

export async function getCategoryById(id: number | string): Promise<Category> {
  const response = await apiClient.get<RawCategory>(`/api/categories/${id}`);
  return normalizeCategory(response.data, 0);
}
