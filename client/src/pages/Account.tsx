import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchUserOrders,
  fetchUserProfile,
  logoutUser,
  updateUserProfile,
  type UserOrder,
  type UserProfile,
} from "../services/userService";
import {
  flattenRoleNames,
  isAdminUser,
  setStoredUser,
  type StoredUser,
} from "../utils/auth";

function formatDate(value: string) {
  return new Date(value).toLocaleString("fr-BE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function orderTotal(order: UserOrder) {
  return order.orderProducts.reduce(
    (sum, line) => sum + line.quantity * line.priceAtPurchase,
    0
  );
}

function profileToStoredUser(profile: UserProfile): StoredUser {
  const roleNames = flattenRoleNames(profile.roles);
  return {
    id: profile.id,
    username: profile.username,
    email: profile.email,
    roles: roleNames,
    isAdmin: roleNames.some((name) => name.toLowerCase() === "admin"),
  };
}

export default function Account() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadAccount = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [profileData, ordersData] = await Promise.all([
        fetchUserProfile(),
        fetchUserOrders(),
      ]);
      setProfile(profileData);
      setOrders(ordersData);
      setUsername(profileData.username);
      setEmail(profileData.email);
      setStoredUser(profileToStoredUser(profileData));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger le compte");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAccount();
  }, [loadAccount]);

  const handleProfileSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const updated = await updateUserProfile({
        username: username.trim(),
        email: email.trim(),
      });
      setProfile(updated);
      setStoredUser(profileToStoredUser(updated));
      setMessage("Profil mis à jour.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise à jour impossible");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
    } catch {
      // On nettoie la session locale même si l'API échoue.
    } finally {
      setStoredUser(null);
      setLoggingOut(false);
      navigate("/");
    }
  };

  const roles = profile ? flattenRoleNames(profile.roles).join(", ") : "";
  const admin = profile ? isAdminUser(profileToStoredUser(profile)) : false;

  return (
    <main className="bg-white text-black min-h-[70vh] px-6 md:px-10 py-10">
      <section className="max-w-4xl mx-auto">
        <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-3">Compte</p>
        <h1 className="text-3xl md:text-4xl font-serif font-normal mb-2">Mon compte</h1>
        {profile && (
          <p className="text-sm text-gray-600 mb-8">
            Bonjour {profile.username}, bienvenue dans votre espace personnel.
          </p>
        )}

        {loading && <p className="text-sm text-gray-600">Chargement…</p>}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-700 text-sm mb-4">{message}</p>}

        {!loading && profile && (
          <div className="space-y-6">
            <section className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
              <h2 className="text-lg font-serif font-normal mb-4">Informations personnelles</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <dt className="text-[10px] tracking-[2px] uppercase text-gray-500">ID</dt>
                  <dd className="mt-1">{profile.id}</dd>
                </div>
                <div>
                  <dt className="text-[10px] tracking-[2px] uppercase text-gray-500">
                    Membre depuis
                  </dt>
                  <dd className="mt-1">{formatDate(profile.created_at)}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[10px] tracking-[2px] uppercase text-gray-500">Rôles</dt>
                  <dd className="mt-1">{roles || "—"}</dd>
                </div>
              </dl>

              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl">
                <label className="block text-sm">
                  <span className="text-[10px] tracking-[2px] uppercase text-gray-500">
                    Nom d&apos;utilisateur
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    maxLength={255}
                    className="mt-1 w-full border border-gray-300 bg-white px-3 py-2 outline-none focus:border-black"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-[10px] tracking-[2px] uppercase text-gray-500">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 w-full border border-gray-300 bg-white px-3 py-2 outline-none focus:border-black"
                  />
                </label>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-[10px] tracking-[2px] uppercase bg-black text-white hover:opacity-70 disabled:opacity-40"
                >
                  {saving ? "Enregistrement…" : "Enregistrer le profil"}
                </button>
              </form>
            </section>

            <section className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
              <h2 className="text-lg font-serif font-normal mb-4">Mes adresses</h2>
              {profile.addresses.length === 0 ? (
                <p className="text-sm text-gray-600">Aucune adresse enregistrée.</p>
              ) : (
                <ul className="space-y-3 text-sm">
                  {profile.addresses.map((address) => (
                    <li key={address.id} className="border border-gray-200 bg-white p-4 rounded-sm">
                      <p>{address.street}</p>
                      <p>
                        {address.postalCode} {address.city}
                      </p>
                      <p>
                        {address.state}, {address.country}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
              <h2 className="text-lg font-serif font-normal mb-4">Mes commandes</h2>
              {orders.length === 0 ? (
                <p className="text-sm text-gray-600 mb-4">Vous n&apos;avez pas encore passé de commande.</p>
              ) : (
                <ul className="space-y-4">
                  {orders.map((order) => (
                    <li
                      key={order.id}
                      className="border border-gray-200 bg-white p-4 rounded-sm text-sm"
                    >
                      <div className="flex flex-wrap justify-between gap-2 mb-2">
                        <p className="font-medium">Commande #{order.id}</p>
                        <p className="text-gray-600">{formatDate(order.orderDate)}</p>
                      </div>
                      <p className="mb-2">
                        Statut : <span className="font-medium">{order.status.name}</span>
                      </p>
                      <ul className="text-gray-700 space-y-1 mb-2">
                        {order.orderProducts.map((line) => (
                          <li key={`${order.id}-${line.product.id}`}>
                            {line.quantity} × {line.product.name} —{" "}
                            {(line.quantity * line.priceAtPurchase).toFixed(2)} €
                          </li>
                        ))}
                      </ul>
                      <p className="font-medium">Total : {orderTotal(order).toFixed(2)} €</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/produits"
                className="px-5 py-3 text-xs tracking-widest uppercase border border-gray-300 bg-white text-black hover:opacity-60 transition-opacity"
              >
                Continuer mes achats
              </Link>
              {admin && (
                <Link
                  to="/admin"
                  className="px-5 py-3 text-xs tracking-widest uppercase bg-black text-white hover:opacity-70 transition-opacity"
                >
                  Administration
                </Link>
              )}
              <button
                type="button"
                onClick={() => void handleLogout()}
                disabled={loggingOut}
                className="px-5 py-3 text-xs tracking-widest uppercase border border-red-700 text-red-700 hover:opacity-60 transition-opacity disabled:opacity-40"
              >
                {loggingOut ? "Déconnexion…" : "Se déconnecter"}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
