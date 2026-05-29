import { getCategoryById } from "../services/categoryService";
import type { Category } from "../types/category";
import { useAsyncData } from "./useAsyncData";

const CATEGORY_LOAD_ERROR = "Impossible de charger cette catégorie.";
const CATEGORY_NOT_FOUND_ERROR = "Catégorie introuvable.";

export function getCategoryLoadErrorMessage(error: unknown): string {
  const status = (error as { response?: { status?: number } })?.response?.status;
  if (status === 404) {
    return CATEGORY_NOT_FOUND_ERROR;
  }
  return CATEGORY_LOAD_ERROR;
}

export function useCategory(categoryId: number | null) {
  const idKey = categoryId ?? 0;

  const { data, loading, error, reload } = useAsyncData<Category>(
    () => {
      if (!categoryId) {
        return Promise.reject(new Error(CATEGORY_NOT_FOUND_ERROR));
      }
      return getCategoryById(categoryId).catch((err: unknown) => {
        throw new Error(getCategoryLoadErrorMessage(err));
      });
    },
    [idKey],
    CATEGORY_LOAD_ERROR,
  );

  return {
    category: data,
    isLoading: loading,
    errorMessage: error,
    reload,
  };
}
