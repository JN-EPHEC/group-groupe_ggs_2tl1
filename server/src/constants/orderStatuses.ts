export const ORDER_STATUS_NAMES = [
  "En attente",
  "Validée",
  "Expédiée",
  "Livrée",
  "Annulée",
] as const;

export type OrderStatusName = (typeof ORDER_STATUS_NAMES)[number];
