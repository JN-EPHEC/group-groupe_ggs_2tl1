import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import type { Product as ProductModel } from "../types/product";

function Product() {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage(null);

    getProducts()
      .then((result) => {
        setProducts(result);
      })
      .catch((error) => {
        console.error("Erreur lors de la recuperation des produits:", error);
        setErrorMessage(
          "Une erreur est survenue pendant le chargement des produits.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="bg-white text-black min-h-[70vh] px-6 md:px-10 py-10">
      <section className="max-w-7xl mx-auto">
        <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-3">
          Catalogue
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-normal mb-8">
          Tous les produits
        </h1>

        {isLoading && (
          <div className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
            <p className="text-sm text-gray-700 mb-4">Chargement des produits...</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 bg-gray-200 animate-pulse rounded-sm"
                />
              ))}
            </div>
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="border border-red-200 rounded-sm p-6 md:p-8 bg-red-50">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        {!isLoading && !errorMessage && products.length === 0 && (
          <div className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
            <p className="text-sm text-gray-700">Aucun produit disponible.</p>
          </div>
        )}

        {!isLoading && !errorMessage && products.length > 0 && (
          <div className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
            <p className="text-sm text-gray-700 mb-4">
              Produits charges: {products.length}
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              {products.slice(0, 8).map((product) => (
                <li key={product.id}>
                  {product.name} - {product.price} EUR
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}

export default Product;