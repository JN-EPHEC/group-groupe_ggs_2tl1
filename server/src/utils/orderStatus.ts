import { ORDER_STATUS_NAMES } from "../constants/orderStatuses.js";

export type OrderStatusName = (typeof ORDER_STATUS_NAMES)[number];

const FORWARD_TRANSITIONS: Record<OrderStatusName, OrderStatusName[]> = {
  "En attente": ["Validée"],
  Validée: ["Expédiée"],
  Expédiée: ["Livrée"],
  Livrée: [],
  Annulée: [],
};

export function isKnownOrderStatus(status: string): status is OrderStatusName {
  return ORDER_STATUS_NAMES.includes(status as OrderStatusName);
}

export function canTransitionOrderStatus(from: string, to: string): boolean {
  if (!isKnownOrderStatus(from) || !isKnownOrderStatus(to)) {
    return false;
  }

  if (from === to) {
    return false;
  }

  if (to === "Annulée") {
    return from !== "Annulée";
  }

  return FORWARD_TRANSITIONS[from].includes(to);
}
