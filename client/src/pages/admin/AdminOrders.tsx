import { useCallback, useEffect, useState } from "react";
import {
  fetchAdminOrders,
  updateAdminOrderStatus,
  type AdminOrder,
} from "../../services/adminService";

function formatDate(value: string) {
  return new Date(value).toLocaleString("fr-BE");
}

function allowedNextStatuses(current: string): string[] {
  if (current === "Annulée" || current === "Livrée") {
    return [];
  }

  const forward: Record<string, string> = {
    "En attente": "Validée",
    Validée: "Expédiée",
    Expédiée: "Livrée",
  };

  const options: string[] = [];
  const next = forward[current];
  if (next) {
    options.push(next);
  }
  options.push("Annulée");
  return options;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [draftStatus, setDraftStatus] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminOrders();
      setOrders(data);
      setDraftStatus(Object.fromEntries(data.map((order) => [order.id, order.status.name])));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger les commandes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const saveStatus = async (orderId: number) => {
    const statut = draftStatus[orderId];
    if (!statut) {
      return;
    }

    setSavingId(orderId);
    setError("");
    setMessage("");
    try {
      await updateAdminOrderStatus(orderId, statut);
      setMessage("Statut mis à jour. Un e-mail a été envoyé au client.");
      await loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise à jour impossible");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <h2 className="text-xl font-serif font-normal mb-4">Commandes</h2>
      <p className="text-sm text-gray-600 mb-6">
        Workflow : En attente → Validée → Expédiée → Livrée. Annulation possible à tout moment avant Livrée/Annulée.
      </p>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      {message && <p className="text-green-700 text-sm mb-4">{message}</p>}

      {loading ? (
        <p className="text-sm text-gray-600">Chargement…</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-gray-600">Aucune commande.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const options = allowedNextStatuses(order.status.name);
            const canChange = options.length > 0;

            return (
              <article key={order.id} className="border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <p className="font-medium">Commande #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {order.user.username} — {order.user.email}
                    </p>
                    <p className="text-sm text-gray-600">{formatDate(order.orderDate)}</p>
                  </div>
                  <p className="text-sm">
                    Statut actuel : <span className="font-medium">{order.status.name}</span>
                  </p>
                </div>

                <ul className="text-sm mb-3 list-disc pl-5">
                  {order.orderProducts.map((line) => (
                    <li key={`${order.id}-${line.product.id}`}>
                      {line.product.name} × {line.quantity}
                    </li>
                  ))}
                </ul>

                {canChange ? (
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <select
                      value={draftStatus[order.id] ?? order.status.name}
                      onChange={(e) =>
                        setDraftStatus((current) => ({ ...current, [order.id]: e.target.value }))
                      }
                      className="border border-gray-300 bg-white px-2 py-1 text-sm"
                    >
                      <option value={order.status.name}>{order.status.name} (actuel)</option>
                      {options.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={
                        savingId === order.id ||
                        (draftStatus[order.id] ?? order.status.name) === order.status.name
                      }
                      onClick={() => void saveStatus(order.id)}
                      className="text-[10px] tracking-[1px] uppercase underline disabled:opacity-40"
                    >
                      {savingId === order.id ? "Enregistrement…" : "Appliquer le statut"}
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aucune transition disponible.</p>
                )}

                {order.statusHistory.length > 0 && (
                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer underline">Historique</summary>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      {order.statusHistory.map((entry) => (
                        <li key={entry.id}>
                          {formatDate(entry.changed_at)} :{" "}
                          {entry.from_status ? `${entry.from_status} → ` : ""}
                          {entry.to_status}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
