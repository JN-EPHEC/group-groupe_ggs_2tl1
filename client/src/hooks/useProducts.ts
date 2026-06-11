import { getProducts, type GetProductsParams } from "../services/productService";
import type { Product } from "../types/product";
import { useAsyncData } from "./useAsyncData";

export const PRODUCTS_LOAD_ERROR =
  "Une erreur est survenue pendant le chargement des produits.";

export function getProductsLoadErrorMessage(): string {
  return PRODUCTS_LOAD_ERROR;
}

export type UseProductsOptions = {
  loadErrorMessage?: string;
};

export function useProducts(
  params: GetProductsParams = {},
  options: UseProductsOptions = {},
) {
  const paramsKey = JSON.stringify(params);
  const loadErrorMessage = options.loadErrorMessage ?? PRODUCTS_LOAD_ERROR;

  const { data, loading, error, reload } = useAsyncData<Product[]>(
    () => getProducts(params),
    [paramsKey],
    loadErrorMessage,
  );

  return {
    products: data ?? [],
    isLoading: loading,
    errorMessage: error,
    reload,
  };
}
