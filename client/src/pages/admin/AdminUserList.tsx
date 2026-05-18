import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { fetchAdminUsers, type AdminUser } from "../../services/adminService";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-BE");
}

function primaryRole(user: AdminUser) {
  return user.roles[0]?.role.name ?? "—";
}

function statusLabel(active: boolean) {
  return active ? "Actif" : "Bloqué";
}

export default function AdminUserList() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminUsers(query, page);
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    setPage(1);
    setQuery(search);
  };

  return (
    <>
      <h2 className="text-xl font-serif font-normal mb-4">Utilisateurs</h2>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou email"
          className="flex-1 border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
        />
        <button
          type="submit"
          className="px-5 py-2 text-[10px] tracking-[2px] uppercase bg-black text-white hover:opacity-70 transition-opacity"
        >
          Rechercher
        </button>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-600">Chargement…</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-600">Aucun utilisateur trouvé.</p>
      ) : (
        <>
          <p className="text-xs text-gray-500 mb-3">{total} utilisateur(s)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-300 text-left text-[10px] tracking-[2px] uppercase text-gray-500">
                  <th className="py-2 pr-4">Nom</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Rôle</th>
                  <th className="py-2 pr-4">Inscription</th>
                  <th className="py-2 pr-4">Statut</th>
                  <th className="py-2"> </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200">
                    <td className="py-3 pr-4">{user.username}</td>
                    <td className="py-3 pr-4">{user.email}</td>
                    <td className="py-3 pr-4">{primaryRole(user)}</td>
                    <td className="py-3 pr-4">{formatDate(user.created_at)}</td>
                    <td className="py-3 pr-4">
                      <span className={user.isActive ? "text-green-700" : "text-red-700"}>
                        {statusLabel(user.isActive)}
                      </span>
                    </td>
                    <td className="py-3">
                      <Link
                        to={`/admin/utilisateurs/${user.id}`}
                        className="text-[10px] tracking-[1px] uppercase underline"
                      >
                        Détail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="text-[10px] tracking-[2px] uppercase disabled:opacity-30"
            >
              Précédent
            </button>
            <span className="text-xs text-gray-500">
              Page {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="text-[10px] tracking-[2px] uppercase disabled:opacity-30"
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </>
  );
}
