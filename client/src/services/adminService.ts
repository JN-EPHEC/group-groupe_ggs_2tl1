import { getToken } from "../utils/auth";

async function adminFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`/api/admin${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof data.message === "string" ? data.message : "Erreur serveur";
    throw new Error(message);
  }

  return data;
}

export type AdminUser = {
  id: number;
  username: string;
  email: string;
  created_at: string;
  isActive: boolean;
  roles: Array<{ role: { id: number; name: string } }>;
};

export type AdminUserListResponse = {
  users: AdminUser[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type AdminUserDetail = AdminUser & {
  orders: Array<{
    id: number;
    orderDate: string;
    status: { id: number; name: string };
    orderProducts: Array<{
      quantity: number;
      product: { id: number; name: string };
    }>;
  }>;
};

export function fetchAdminUsers(search: string, page: number) {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  params.set("page", String(page));
  return adminFetch(`/users?${params.toString()}`) as Promise<AdminUserListResponse>;
}

export function fetchAdminUser(id: number) {
  return adminFetch(`/users/${id}`) as Promise<AdminUserDetail>;
}

export function deleteAdminUser(id: number) {
  return adminFetch(`/users/${id}`, { method: "DELETE" }) as Promise<{
    message: string;
    user: AdminUser;
  }>;
}

export type AdminProductStock = {
  id: number;
  name: string;
  stock: number;
  price: number;
  isActive: boolean;
  category: { id: number; name: string };
};

export function fetchAdminProducts(sort = "stock_asc") {
  return adminFetch(`/products?sort=${encodeURIComponent(sort)}`) as Promise<AdminProductStock[]>;
}

export function updateAdminProductStock(id: number, quantite: number) {
  return adminFetch(`/products/${id}/stock`, {
    method: "PUT",
    body: JSON.stringify({ quantite }),
  }) as Promise<AdminProductStock>;
}
