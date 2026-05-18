import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchAdminUser, type AdminUserDetail } from "../../services/adminService";

function formatDate(value: string) {
  return new Date(value).toLocaleString("fr-BE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const userId = Number(id);
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  if (error || !user) {
    return (
      <>
        <p className="text-red-600 text-sm mb-4">{error || "Utilisateur introuvable"}</p>
        <Link to="/admin/utilisateurs" className="text-[10px] tracking-[1px] uppercase underline">
          Retour à la liste
        </Link>
      </>
    );
  }

  const roles = user.roles.map((entry) => entry.role.name).join(", ");

  return (
    <>
      <Link
        to="/admin/utilisateurs"
        className="text-[10px] tracking-[1px] uppercase underline text-gray-500 mb-6 inline-block"
      >
        ← Retour à la liste
      </Link>

      <h2 className="text-xl font-serif font-normal mb-6">{user.username}</h2>

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
    </>
  );
}
