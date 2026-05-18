import { Link } from "react-router-dom";

function Account() {
  return (
    <main className="bg-white text-black min-h-[70vh] px-6 md:px-10 py-10">
      <section className="max-w-4xl mx-auto">
        <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-3">
          Compte
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-normal mb-8">
          Mon compte
        </h1>
        <div className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
          <p className="text-sm text-gray-800 mb-6">
            Espace personnel (à compléter).
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/produits"
              className="px-5 py-3 text-xs tracking-widest uppercase border border-gray-300 bg-white text-black hover:opacity-60 transition-opacity"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Account;

