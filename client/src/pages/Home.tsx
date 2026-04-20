//Home page 
const categories = [
  { label: "Nouveautés", sub: "Collection printemps" },
  { label: "Bestsellers", sub: "Les incontournables" },
  { label: "Accessoires", sub: "Compléter le look" },
];

const featured = [
  { title: "Veste structurée", price: "89,99 €", tag: "Nouveau" },
  { title: "Pantalon tailleur", price: "69,99 €", tag: null },
  { title: "Robe midi", price: "59,99 €", tag: "Tendance" },
  { title: "Blazer oversize", price: "99,99 €", tag: null },
];

function Home(){
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
          {featured.map((product, i) => (
            <div key={i} className="group cursor-pointer">
              {/* Image placeholder */}
              <div className="relative overflow-hidden aspect-[3/4]">
                <div
                  className={`w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105 ${
                    i % 2 === 0 ? "bg-[#e8e4df]" : "bg-[#ddd9d4]"
                  }`}
                >
                  <span className="text-[10px] tracking-widest text-gray-400 uppercase">
                    Photo
                  </span>
                </div>
                {product.tag && (
                  <span className="absolute top-4 left-4 text-[9px] tracking-widest uppercase bg-black text-white px-2 py-1">
                    {product.tag}
                  </span>
                )}
              </div>
              <div className="pt-4 pb-2">
                <p className="text-sm mb-1.5">{product.title}</p>
                <p className="text-sm text-gray-500">{product.price}</p>
              </div>
            </div>
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