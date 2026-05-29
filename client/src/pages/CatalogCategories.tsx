import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import { productsByCategoryUrl } from "../utils/catalogUrls";

export default function CatalogCategories() {
  const { categories, isLoading, errorMessage } = useCategories();

  return (
    <main className="bg-white text-black min-h-[70vh] px-6 md:px-10 py-10">
      <section className="max-w-7xl mx-auto">
        <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-3">
          Catalogue
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-normal mb-3">
          Nos catégories
        </h1>
        <p className="text-sm text-gray-600 mb-8 max-w-2xl">
          Choisissez une catégorie pour découvrir les produits correspondants.
        </p>

        {isLoading && (
          <div className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
            <p className="text-sm text-gray-700 mb-4">Chargement des catégories…</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {!isLoading && !errorMessage && categories.length === 0 && (
          <div className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
            <p className="text-sm text-gray-700">Aucune catégorie disponible.</p>
          </div>
        )}

        {!isLoading && !errorMessage && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={productsByCategoryUrl(category.id)}
                className="group border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7] hover:bg-[#f0eeeb] transition-colors"
              >
                <p className="text-[10px] tracking-[2px] uppercase text-gray-500 mb-2">
                  Catégorie
                </p>
                <h2 className="text-2xl font-serif font-normal mb-4">{category.name}</h2>
                <span className="text-[10px] tracking-[2px] uppercase border-b border-black pb-0.5 group-hover:opacity-40 transition-opacity">
                  Voir les produits →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
