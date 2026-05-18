import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  createAdminCategory,
  deleteAdminCategory,
  fetchAdminCategories,
  updateAdminCategory,
  type AdminCategory,
} from "../../services/adminService";

export default function AdminCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger les catégories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    const name = newName.trim();
    if (!name) {
      setError("Le nom est obligatoire");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      await createAdminCategory(name);
      setNewName("");
      setMessage("Catégorie créée.");
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Création impossible");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (category: AdminCategory) => {
    setEditingId(category.id);
    setEditName(category.name);
    setError("");
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveEdit = async (categoryId: number) => {
    const name = editName.trim();
    if (!name) {
      setError("Le nom est obligatoire");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      await updateAdminCategory(categoryId, name);
      setEditingId(null);
      setMessage("Catégorie mise à jour.");
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise à jour impossible");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category: AdminCategory) => {
    if (category._count.products > 0) {
      setError("Impossible de supprimer une catégorie liée à des produits");
      return;
    }

    if (!window.confirm(`Supprimer la catégorie « ${category.name} » ?`)) {
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      await deleteAdminCategory(category.id);
      setMessage("Catégorie supprimée.");
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-serif font-normal mb-4">Catégories</h2>

      {message && <p className="mb-4 text-green-700">{message}</p>}
      {error && <p className="mb-4 text-red-700">{error}</p>}

      <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nouvelle catégorie"
          maxLength={100}
          className="flex-1 border border-neutral-300 px-3 py-2"
        />
        <button
          type="submit"
          disabled={saving}
          className="bg-neutral-900 text-white px-4 py-2 disabled:opacity-50"
        >
          Ajouter
        </button>
      </form>

      {loading ? (
        <p>Chargement…</p>
      ) : categories.length === 0 ? (
        <p>Aucune catégorie.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[480px]">
          <thead>
            <tr className="border-b border-neutral-300 text-left">
              <th className="py-2 pr-4">Nom</th>
              <th className="py-2 pr-4">Produits</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-neutral-200">
                <td className="py-3 pr-4">
                  {editingId === category.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      maxLength={100}
                      className="w-full border border-neutral-300 px-2 py-1"
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td className="py-3 pr-4">{category._count.products}</td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-2">
                    {editingId === category.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => void saveEdit(category.id)}
                          disabled={saving}
                          className="underline disabled:opacity-50"
                        >
                          Enregistrer
                        </button>
                        <button type="button" onClick={cancelEdit} className="underline">
                          Annuler
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => startEdit(category)} className="underline">
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(category)}
                          disabled={saving || category._count.products > 0}
                          className="underline text-red-700 disabled:opacity-40"
                        >
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      )}
    </>
  );
}
