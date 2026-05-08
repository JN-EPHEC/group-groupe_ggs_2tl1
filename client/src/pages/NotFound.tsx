import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="bg-white text-black min-h-[70vh] px-6 md:px-10 py-16">
      <section className="max-w-3xl mx-auto border border-gray-200 rounded-sm p-8 bg-[#faf9f7] text-center">
        <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-3">
          404
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-normal mb-4">
          Page introuvable
        </h1>
        <p className="text-sm text-gray-700 mb-8">
          La page demandée n’existe pas ou a été déplacée.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/"
            className="px-5 py-3 text-xs tracking-widest uppercase border border-black bg-black text-white hover:opacity-70 transition-opacity"
          >
            Retour à l’accueil
          </Link>
          <Link
            to="/produits"
            className="px-5 py-3 text-xs tracking-widest uppercase border border-gray-300 bg-white text-black hover:opacity-60 transition-opacity"
          >
            Voir le catalogue
          </Link>
        </div>
      </section>
    </main>
  );
}

export default NotFound;

