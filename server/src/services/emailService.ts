type OrderStatusEmailInput = {
  to: string;
  orderId: number;
  newStatus: string;
};

export async function sendOrderStatusEmail(input: OrderStatusEmailInput): Promise<void> {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  console.info(
    `[email] Commande #${input.orderId} → statut "${input.newStatus}" (destinataire: ${input.to})`
  );
}
