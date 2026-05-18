import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteAdminProduct,
  fetchAdminProduct,
  fetchCategories,
  updateAdminProduct,
  type AdminProductDetail,
  type CategoryOption,
} from "../../services/adminService";

export default function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = Number(id);

  const [product, setProduct] = useState<AdminProductDetail | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    if (!Number.isInteger(productId) || productId <= 0) {
      setError("Produit invalide");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const [productData, categoryData] = await Promise.all([
        fetchAdminProduct(productId),
        fetchCategories(),
      ]);
      setProduct(productData);
      setCategories(categoryData);
      setName(productData.name);
      setDescription(productData.description);
      setPrice(String(productData.price));
      setStock(String(productData.stock));
      setCategoryId(String(productData.category_id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement impossible");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await updateAdminProduct(productId, {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock),
        category_id: Number(categoryId),
      });
      setProduct(updated);
      setSuccess("Produit mis à jour avec succès.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise à jour impossible");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      const result = await deleteAdminProduct(productId);
      setShowDeleteModal(false);
      navigate("/admin/stocks", {
        state: {
          message:
            result.mode === "soft"
              ? "Produit désactivé (présent dans des commandes)."
              : "Produit supprimé.",
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-600">Chargement…</p>;
  }

  if (!product) {
    return (
      <>
        <p className="text-red-600 text-sm mb-4">{error || "Produit introuvable"}</p>
        <Link to="/admin/stocks" className="text-[10px] tracking-[1px] uppercase underline">
          Retour aux stocks
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        to="/admin/stocks"
        className="text-[10px] tracking-[1px] uppercase underline text-gray-500 mb-6 inline-block"
      >
        ← Retour aux stocks
      </Link>

      <h2 className="text-xl font-serif font-normal mb-2">Modifier le produit</h2>
      {!product.isActive && (
        <p className="text-sm text-amber-700 mb-4">Ce produit est désactivé (hors catalogue).</p>
      )}

      {success && <p className="text-green-700 text-sm mb-4">{success}</p>}
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
        <label className="block text-sm">
          <span className="text-[10px] tracking-[2px] uppercase text-gray-500">Nom</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={255}
            required
            className="mt-1 w-full border border-gray-300 bg-white px-3 py-2 outline-none focus:border-black"
          />
        </label>

        <label className="block text-sm">
          <span className="text-[10px] tracking-[2px] uppercase text-gray-500">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            rows={4}
            className="mt-1 w-full border border-gray-300 bg-white px-3 py-2 outline-none focus:border-black"
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block text-sm">
            <span className="text-[10px] tracking-[2px] uppercase text-gray-500">Prix (€)</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 bg-white px-3 py-2 outline-none focus:border-black"
            />
          </label>
          <label className="block text-sm">
            <span className="text-[10px] tracking-[2px] uppercase text-gray-500">Stock</span>
            <input
              type="number"
              min={0}
              step={1}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 bg-white px-3 py-2 outline-none focus:border-black"
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="text-[10px] tracking-[2px] uppercase text-gray-500">Catégorie</span>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="mt-1 w-full border border-gray-300 bg-white px-3 py-2 outline-none focus:border-black"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-[10px] tracking-[2px] uppercase bg-black text-white hover:opacity-70 disabled:opacity-40"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-5 py-2 text-[10px] tracking-[2px] uppercase border border-red-700 text-red-700 hover:opacity-60"
          >
            Supprimer
          </button>
        </div>
      </form>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            className="bg-white border border-gray-200 rounded-sm p-6 max-w-md w-full shadow-lg"
            role="dialog"
            aria-modal={true}
          >
            <h3 className="text-lg font-serif font-normal mb-3">Confirmer la suppression</h3>
            <p className="text-sm text-gray-700 mb-6">
              Si le produit est lié à des commandes, il sera désactivé. Sinon il sera supprimé
              définitivement.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-4 py-2 text-[10px] tracking-[2px] uppercase border border-gray-300"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleting}
                className="px-4 py-2 text-[10px] tracking-[2px] uppercase bg-red-700 text-white disabled:opacity-50"
              >
                {deleting ? "Suppression…" : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
