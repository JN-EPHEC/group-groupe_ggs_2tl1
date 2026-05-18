import { describe, expect, it } from "@jest/globals";
import { canTransitionOrderStatus } from "../utils/orderStatus";

describe("orderStatus utils", () => {
  it("autorise les transitions attendues", () => {
    expect(canTransitionOrderStatus("En attente", "Validée")).toBe(true);
    expect(canTransitionOrderStatus("Validée", "Expédiée")).toBe(true);
    expect(canTransitionOrderStatus("Expédiée", "Livrée")).toBe(true);
  });

  it("autorise l'annulation", () => {
    expect(canTransitionOrderStatus("En attente", "Annulée")).toBe(true);
    expect(canTransitionOrderStatus("Livrée", "Annulée")).toBe(true);
  });

  it("refuse les transitions invalides", () => {
    expect(canTransitionOrderStatus("En attente", "Livrée")).toBe(false);
    expect(canTransitionOrderStatus("Annulée", "Validée")).toBe(false);
  });
});
