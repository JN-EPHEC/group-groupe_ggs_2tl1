import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import type { Product as ProductModel } from "../types/product";
import ProductCard from "../components/ProductCard";

const PAGE_SIZE = 12;

function clampPage(page: number, totalPages: number) {
  if (totalPages <= 1) {
    return 1;
  }
  return Math.min(Math.max(page, 1), totalPages);
}

function Product() {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getProducts()
      .then((result) => {
        setProducts(result);
        setCurrentPage(1);
        setErrorMessage(null);
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

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const safePage = clampPage(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const currentProducts = products.slice(startIndex, startIndex + PAGE_SIZE);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 bg-gray-200 animate-pulse rounded-sm"
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
            <p className="text-sm text-gray-700 mb-6">
              Produits charges: {products.length} — Page {safePage} / {totalPages}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => clampPage(p - 1, totalPages))
                  }
                  disabled={safePage === 1}
                  className="px-3 py-2 text-xs tracking-widest uppercase border border-gray-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-60 transition-opacity"
                >
                  Precedent
                </button>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  const isActive = page === safePage;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(clampPage(page, totalPages))}
                      aria-current={isActive ? "page" : undefined}
                      className={`min-w-10 px-3 py-2 text-xs tracking-widest uppercase border transition-opacity hover:opacity-60 ${
                        isActive
                          ? "border-black bg-black text-white"
                          : "border-gray-300 bg-white text-black"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => clampPage(p + 1, totalPages))
                  }
                  disabled={safePage === totalPages}
                  className="px-3 py-2 text-xs tracking-widest uppercase border border-gray-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-60 transition-opacity"
                >
                  Suivant
                </button>
              </nav>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Product;
