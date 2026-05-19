import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  fetchAdminProducts,
  updateAdminProductStock,
  type AdminProductStock,
} from "../../services/adminService";

const LOW_STOCK_THRESHOLD = 5;

function stockStatus(stock: number) {
  if (stock === 0) {
    return { label: "Rupture", className: "text-red-700 font-medium" };
  }
  if (stock <= LOW_STOCK_THRESHOLD) {
    return { label: "Stock faible", className: "text-amber-700 font-medium" };
  }
  return { label: "OK", className: "text-green-700" };
}

export default function AdminStockList() {
  const location = useLocation();
  const flashMessage =
    location.state && typeof location.state === "object" && "message" in location.state
      ? String((location.state as { message: unknown }).message)
      : "";

  const [products, setProducts] = useState<AdminProductStock[]>([]);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminProducts("stock_asc");
      setProducts(data);
      setDrafts(
        Object.fromEntries(data.map((product) => [product.id, String(product.stock)]))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger les stocks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const handleDraftChange = (productId: number, value: string) => {
    setDrafts((current) => ({ ...current, [productId]: value }));
  };

  const saveStock = async (productId: number) => {
    const quantite = Number(drafts[productId]);
    if (!Number.isInteger(quantite) || quantite < 0) {
      setError("La quantité doit être un entier ≥ 0");
      return;
    }

    setSavingId(productId);
    setError("");
    setMessage("");
    try {
      await updateAdminProductStock(productId, quantite);
      setMessage("Stock mis à jour.");
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise à jour impossible");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <h2 className="text-xl font-serif font-normal mb-4">Stocks</h2>
      <p className="text-sm text-gray-600 mb-6">
        Produits en rupture (0) ou stock faible (≤ {LOW_STOCK_THRESHOLD}) mis en évidence.
      </p>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      {flashMessage && <p className="text-green-700 text-sm mb-4">{flashMessage}</p>}
      {message && <p className="text-green-700 text-sm mb-4">{message}</p>}

      {loading ? (
        <p className="text-sm text-gray-600">Chargement…</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-gray-600">Aucun produit.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-300 text-left text-[10px] tracking-[2px] uppercase text-gray-500">
                <th className="py-2 pr-4">Produit</th>
                <th className="py-2 pr-4">Catégorie</th>
                <th className="py-2 pr-4">Statut</th>
                <th className="py-2 pr-4">Quantité</th>
                <th className="py-2"> </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const status = stockStatus(product.stock);
                const rowClass =
                  product.stock === 0
                    ? "bg-red-50"
                    : product.stock <= LOW_STOCK_THRESHOLD
                      ? "bg-amber-50"
                      : "";

                return (
                  <tr key={product.id} className={`border-b border-gray-200 ${rowClass}`}>
                    <td className="py-3 pr-4 font-medium">{product.name}</td>
                    <td className="py-3 pr-4">{product.category.name}</td>
                    <td className={`py-3 pr-4 ${status.className}`}>{status.label}</td>
                    <td className="py-3 pr-4">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={drafts[product.id] ?? ""}
                        onChange={(e) => handleDraftChange(product.id, e.target.value)}
                        className="w-24 border border-gray-300 bg-white px-2 py-1 text-sm outline-none focus:border-black"
                      />
                    </td>
                    <td className="py-3">
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          disabled={savingId === product.id}
                          onClick={() => void saveStock(product.id)}
                          className="text-[10px] tracking-[1px] uppercase underline disabled:opacity-40 text-left"
                        >
                          {savingId === product.id ? "Enregistrement…" : "Enregistrer"}
                        </button>
                        <Link
                          to={`/admin/produits/${product.id}`}
                          className="text-[10px] tracking-[1px] uppercase underline text-left"
                        >
                          Modifier
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
