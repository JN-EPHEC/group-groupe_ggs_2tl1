async function userFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`/api${path}`, {
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

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  created_at: string;
  addresses: Array<{
    id: number;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>;
  roles: Array<{ role: { id: number; name: string } }>;
};

export type UserOrder = {
  id: number;
  orderDate: string;
  status: { id: number; name: string };
  orderProducts: Array<{
    quantity: number;
    priceAtPurchase: number;
    product: { id: number; name: string };
  }>;
};

export function fetchUserProfile() {
  return userFetch("/users/me") as Promise<UserProfile>;
}

export function updateUserProfile(payload: { username?: string; email?: string }) {
  return userFetch("/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  }) as Promise<UserProfile>;
}

export function fetchUserOrders() {
  return userFetch("/orders") as Promise<UserOrder[]>;
}

export function fetchUserAddresses() {
  return userFetch("/addresses/me") as Promise<UserProfile["addresses"]>;
}

export async function logoutUser() {
  await userFetch("/auth/logout", { method: "POST" });
}
