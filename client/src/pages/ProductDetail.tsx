import { useEffect, useMemo, useState } from "react";
import { getProductById } from "../services/productService";
import type { Product } from "../types/product";

const PRICE_FORMATTER = new Intl.NumberFormat("fr-BE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function ProductDetail() {
  const productId = useMemo(() => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    return parts[1] ?? "";
  }, []);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getProductById(productId)
      .then((result) => {
        setProduct(result);
        setErrorMessage(null);
      })
      .catch((error) => {
        const status = error?.response?.status;
        if (status === 404) {
          setErrorMessage("Produit introuvable.");
          return;
        }
        setErrorMessage("Erreur lors du chargement du produit.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [productId]);

  return (
    <main className="bg-white text-black min-h-[70vh] px-6 md:px-10 py-10">
      <section className="max-w-4xl mx-auto">
        <a
          href="/produits"
          className="inline-block text-[10px] tracking-[3px] uppercase text-gray-600 hover:opacity-60 mb-6"
        >
          Retour a la liste
        </a>

        {isLoading && <p className="text-sm text-gray-700">Chargement du produit...</p>}

        {!isLoading && errorMessage && (
          <div className="border border-red-200 rounded-sm p-6 bg-red-50">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        {!isLoading && !errorMessage && product && (
          <article className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
            <h1 className="text-3xl md:text-4xl font-serif font-normal mb-3">{product.name}</h1>
            <p className="text-sm text-gray-600 mb-1">{product.category ?? "Non classé"}</p>
            <p className="text-xl font-medium mb-6">{PRICE_FORMATTER.format(product.price)}</p>
            <p className="text-sm text-gray-800 mb-8">
              {product.description ?? "Aucune description disponible."}
            </p>
            <p className="text-sm mb-4">
              Stock: {typeof product.stock === "number" ? product.stock : 0}
            </p>
            <button
              type="button"
              disabled={(product.stock ?? 0) <= 0}
              className="px-5 py-3 text-xs tracking-widest uppercase border border-black bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ajouter au panier
            </button>
          </article>
        )}
      </section>
    </main>
  );
}

export default ProductDetail;
