async function adminFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`/api/admin${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

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

export type AdminProductDetail = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  isActive: boolean;
  category: { id: number; name: string };
};

export type CategoryOption = {
  id: number;
  name: string;
};

export function fetchAdminProduct(id: number) {
  return adminFetch(`/products/${id}`) as Promise<AdminProductDetail>;
}

export function updateAdminProduct(
  id: number,
  payload: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: number;
  }
) {
  return adminFetch(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }) as Promise<AdminProductDetail>;
}

export function deleteAdminProduct(id: number) {
  return adminFetch(`/products/${id}`, { method: "DELETE" }) as Promise<{
    mode: "soft" | "hard";
    product: AdminProductDetail;
  }>;
}

export async function fetchCategories() {
  const response = await fetch("/api/categories");
  const data = await response.json().catch(() => []);
  if (!response.ok) {
    throw new Error("Impossible de charger les catégories");
  }
  return data as CategoryOption[];
}

export type AdminCategory = {
  id: number;
  name: string;
  _count: { products: number };
};

export function fetchAdminCategories() {
  return adminFetch("/categories") as Promise<AdminCategory[]>;
}

export function createAdminCategory(name: string) {
  return adminFetch("/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  }) as Promise<AdminCategory>;
}

export function updateAdminCategory(id: number, name: string) {
  return adminFetch(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  }) as Promise<AdminCategory>;
}

export function deleteAdminCategory(id: number) {
  return adminFetch(`/categories/${id}`, { method: "DELETE" }) as Promise<AdminCategory>;
}

export const ORDER_STATUS_OPTIONS = [
  "En attente",
  "Validée",
  "Expédiée",
  "Livrée",
  "Annulée",
] as const;

export type AdminOrder = {
  id: number;
  orderDate: string;
  status: { id: number; name: string };
  user: { id: number; username: string; email: string };
  orderProducts: Array<{
    quantity: number;
    product: { id: number; name: string };
  }>;
  statusHistory: Array<{
    id: number;
    from_status: string | null;
    to_status: string;
    changed_at: string;
  }>;
};

export function fetchAdminOrders() {
  return adminFetch("/orders") as Promise<AdminOrder[]>;
}

export function updateAdminOrderStatus(id: number, statut: string) {
  return adminFetch(`/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ statut }),
  }) as Promise<AdminOrder>;
}
