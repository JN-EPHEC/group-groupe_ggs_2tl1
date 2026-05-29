import { getCategories } from "../services/categoryService";
import type { Category } from "../types/category";
import { useAsyncData } from "./useAsyncData";

export const CATEGORIES_LOAD_ERROR =
  "Une erreur est survenue pendant le chargement des catégories.";

export function getCategoriesLoadErrorMessage(): string {
  return CATEGORIES_LOAD_ERROR;
}

export function useCategories() {
  const { data, loading, error, reload } = useAsyncData<Category[]>(
    () => getCategories(),
    [],
    CATEGORIES_LOAD_ERROR,
  );

  return {
    categories: data ?? [],
    isLoading: loading,
    errorMessage: error,
    reload,
  };
}
