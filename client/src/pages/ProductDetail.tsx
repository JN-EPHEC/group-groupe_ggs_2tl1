import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addToCart } from "../services/cartService";
import { useProduct } from "../hooks/useProduct";

const PRICE_FORMATTER = new Intl.NumberFormat("fr-BE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function ProductDetail() {
  const { id: productId = "" } = useParams();

  const { product, isLoading, errorMessage } = useProduct(productId);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  return (
    <main className="bg-white text-black min-h-[70vh] px-6 md:px-10 py-10">
      <section className="max-w-4xl mx-auto">
        <nav aria-label="Fil d’Ariane" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] tracking-[3px] uppercase text-gray-600">
            <li>
              <Link to="/" className="hover:opacity-60">
                Accueil
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-400">
              &gt;
            </li>
            <li>
              <Link to="/produits" className="hover:opacity-60">
                Produits
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-400">
              &gt;
            </li>
            <li className="text-gray-800">
              {isLoading ? "Chargement…" : errorMessage ? "Détail" : product?.name ?? "Détail"}
            </li>
          </ol>
        </nav>

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
              onClick={() => {
                addToCart(product);
                setCartMessage("Produit ajouté au panier.");
              }}
              disabled={(product.stock ?? 0) <= 0}
              className="px-5 py-3 text-xs tracking-widest uppercase border border-black bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ajouter au panier
            </button>
            {cartMessage && (
              <p className="mt-4 text-sm text-gray-700">{cartMessage}</p>
            )}
          </article>
        )}
      </section>
    </main>
  );
}

export default ProductDetail;
