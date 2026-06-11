import { getProductById } from "../services/productService";
import type { Product } from "../types/product";
import { useAsyncData } from "./useAsyncData";

const PRODUCT_LOAD_ERROR = "Erreur lors du chargement du produit.";
const PRODUCT_NOT_FOUND_ERROR = "Produit introuvable.";

export function getProductLoadErrorMessage(error: unknown): string {
  const status = (error as { response?: { status?: number } })?.response?.status;
  if (status === 404) {
    return PRODUCT_NOT_FOUND_ERROR;
  }
  return PRODUCT_LOAD_ERROR;
}

export function useProduct(productId: string) {
  const { data, loading, error, reload } = useAsyncData<Product>(
    () =>
      getProductById(productId).catch((err: unknown) => {
        throw new Error(getProductLoadErrorMessage(err));
      }),
    [productId],
    PRODUCT_LOAD_ERROR,
  );

  return {
    product: data,
    isLoading: loading,
    errorMessage: error,
    reload,
  };
}
