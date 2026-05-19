import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteAdminUser, fetchAdminUser, type AdminUserDetail } from "../../services/adminService";
import { getStoredUser } from "../../utils/auth";

function formatDate(value: string) {
  return new Date(value).toLocaleString("fr-BE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function AdminUserDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = Number(id);
  const currentUserId = getStoredUser()?.id;
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadUser = useCallback(async () => {
    if (!Number.isInteger(userId) || userId <= 0) {
      setError("Identifiant utilisateur invalide");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminUser(userId);
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger l'utilisateur");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  if (loading) {
    return <p className="text-sm text-gray-600">Chargement…</p>;
  }

  if (error && !user) {
    return (
      <>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <Link to="/admin/utilisateurs" className="text-[10px] tracking-[1px] uppercase underline">
          Retour à la liste
        </Link>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <p className="text-red-600 text-sm mb-4">Utilisateur introuvable</p>
        <Link to="/admin/utilisateurs" className="text-[10px] tracking-[1px] uppercase underline">
          Retour à la liste
        </Link>
      </>
    );
  }

  const roles = user.roles.map((entry) => entry.role.name).join(", ");
  const isSelf = currentUserId === userId;
  const isAnonymized = user.email.endsWith("@anonymized.local");

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await deleteAdminUser(userId);
      setShowDeleteModal(false);
      navigate("/admin/utilisateurs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Link
        to="/admin/utilisateurs"
        className="text-[10px] tracking-[1px] uppercase underline text-gray-500 mb-6 inline-block"
      >
        ← Retour à la liste
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-serif font-normal">{user.username}</h2>
        {!isAnonymized && (
          <button
            type="button"
            disabled={isSelf}
            onClick={() => setShowDeleteModal(true)}
            className="px-5 py-2 text-[10px] tracking-[2px] uppercase border border-red-700 text-red-700 hover:opacity-60 disabled:opacity-30 transition-opacity"
          >
            Supprimer
          </button>
        )}
      </div>

      {isSelf && (
        <p className="text-sm text-gray-600 mb-4">Vous ne pouvez pas supprimer votre propre compte.</p>
      )}
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-8">
        <div>
          <dt className="text-[10px] tracking-[2px] uppercase text-gray-500">Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt className="text-[10px] tracking-[2px] uppercase text-gray-500">Rôle(s)</dt>
          <dd>{roles || "—"}</dd>
        </div>
        <div>
          <dt className="text-[10px] tracking-[2px] uppercase text-gray-500">Inscription</dt>
          <dd>{formatDate(user.created_at)}</dd>
        </div>
        <div>
          <dt className="text-[10px] tracking-[2px] uppercase text-gray-500">Statut</dt>
          <dd className={user.isActive ? "text-green-700" : "text-red-700"}>
            {user.isActive ? "Actif" : "Bloqué"}
          </dd>
        </div>
      </dl>

      <h3 className="text-lg font-serif font-normal mb-4">Commandes</h3>
      {user.orders.length === 0 ? (
        <p className="text-sm text-gray-600">Aucune commande.</p>
      ) : (
        <ul className="space-y-4">
          {user.orders.map((order) => (
            <li key={order.id} className="border border-gray-200 rounded-sm p-4 bg-white">
              <p className="font-medium text-sm">
                Commande #{order.id} — {order.status.name}
              </p>
              <p className="text-xs text-gray-500 mb-2">{formatDate(order.orderDate)}</p>
              <ul className="text-sm text-gray-700 list-disc list-inside">
                {order.orderProducts.map((line) => (
                  <li key={`${order.id}-${line.product.id}`}>
                    {line.product.name} × {line.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            className="bg-white border border-gray-200 rounded-sm p-6 max-w-md w-full shadow-lg"
            role="dialog"
            aria-modal="true"
          >
            <h3 className="text-lg font-serif font-normal mb-3">Confirmer la suppression</h3>
            <p className="text-sm text-gray-700 mb-6">
              Cette action anonymisera les données personnelles de {user.username}. Les commandes
              seront conservées.
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
