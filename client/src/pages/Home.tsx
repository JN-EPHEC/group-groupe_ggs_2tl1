import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

//Home page 
const categories = [
  { label: "Nouveautés", sub: "Collection printemps" },
  { label: "Bestsellers", sub: "Les incontournables" },
  { label: "Accessoires", sub: "Compléter le look" },
];

function Home() {
  const {
    products: featuredProducts,
    isLoading: isLoadingFeatured,
    errorMessage: featuredError,
  } = useProducts(
    { limit: 4 },
    { loadErrorMessage: "Impossible de charger la sélection du moment." },
  );

    return(
 <main className="bg-white text-black">

      {/* ── HERO ── */}
      <section className="relative h-[90vh] bg-[#f5f3f0] flex items-center justify-center overflow-hidden">
        {/* Right background block */}
        <div className="absolute right-0 top-0 w-5/12 h-full bg-[#e8e4df]" />

        <div className="relative z-10 text-center px-10 max-w-2xl">
          <p className="text-[10px] tracking-[4px] uppercase text-gray-400 mb-6">
            Nouvelle collection
          </p>
          <h1 className="text-7xl font-light font-serif leading-[1.05] text-black mb-8">
            L'élégance<br />dans la simplicité
          </h1>
          <a
            href="/produits"
            className="text-[10px] tracking-[3px] uppercase text-black border-b border-black pb-0.5 hover:opacity-40 transition-opacity duration-200"
          >
            Découvrir la collection
          </a>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="px-10 py-20">
        <div className="grid grid-cols-3 gap-0.5">
          {categories.map((cat) => (
            <a
              key={cat.label}
              href="/produits"
              className="bg-[#f5f3f0] px-10 py-16 block group hover:bg-[#ebe8e3] transition-colors duration-300"
            >
              <p className="text-[10px] tracking-[2px] uppercase text-gray-400 mb-3">
                {cat.sub}
              </p>
              <h2 className="text-2xl font-serif font-normal mb-5">
                {cat.label}
              </h2>
              <span className="text-[10px] tracking-[2px] uppercase border-b border-black pb-0.5 group-hover:opacity-40 transition-opacity duration-200">
                Voir →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="px-10 pb-20">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="text-3xl font-serif font-normal">Sélection du moment</h2>
          <a
            href="/produits"
            className="text-[10px] tracking-[2px] uppercase border-b border-black pb-0.5 hover:opacity-40 transition-opacity duration-200"
          >
            Tout voir
          </a>
        </div>

        <div className="grid grid-cols-4 gap-0.5">
          {isLoadingFeatured &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[420px] bg-gray-200 animate-pulse rounded-sm"
              />
            ))}

          {!isLoadingFeatured && featuredError && (
            <div className="col-span-4 border border-red-200 rounded-sm p-6 bg-red-50">
              <p className="text-sm text-red-700">{featuredError}</p>
            </div>
          )}

          {!isLoadingFeatured &&
            !featuredError &&
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>

   {  /* {/* ── EDITORIAL BANNER ── 
      <section className="bg-black text-white px-10 py-28 text-center">
        <p className="text-[10px] tracking-[4px] uppercase text-gray-600 mb-6">
          Notre engagement
        </p>
        <h2 className="text-6xl font-serif font-light leading-[1.1] max-w-xl mx-auto mb-10">
          Mode consciente,<br />style intemporel
        </h2>
        <a
          href="/produits"
          className="text-[10px] tracking-[3px] uppercase text-white border-b border-white pb-0.5 hover:opacity-40 transition-opacity duration-200"
        >
          Explorer
        </a>
      </section>
*/}
    </main>
  );

}

export default Home