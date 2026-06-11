import axios from "axios";
import type { Category } from "../types/category";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>("/api/categories");
  return data;
}

export async function getCategoryById(id: number | string): Promise<Category>{
  const { data } = await apiClient.get<Category>(`/api/categories/${id}`);
  return data;
}