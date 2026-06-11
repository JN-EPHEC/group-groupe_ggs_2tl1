import { describe, expect, it } from "@jest/globals";
import { ORDER_STATUS_NAMES } from "../constants/orderStatuses";

describe("orderStatuses constants", () => {
  it("définit les cinq statuts de commande attendus", () => {
    expect(ORDER_STATUS_NAMES).toEqual([
      "En attente",
      "Validée",
      "Expédiée",
      "Livrée",
      "Annulée",
    ]);
  });

  it("conserve En attente comme statut initial", () => {
    expect(ORDER_STATUS_NAMES[0]).toBe("En attente");
  });
});
