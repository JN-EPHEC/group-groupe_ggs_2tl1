type OrderStatusEmailPayload = {
  to: string;
  username: string;
  orderId: number;
  previousStatus: string;
  nextStatus: string;
};

// Service minimal pour garder l'appel email centralise.
// L'implementation SMTP/Provider pourra remplacer ce fallback sans impacter les controleurs.
export const sendOrderStatusChangedEmail = async (payload: OrderStatusEmailPayload) => {
  // eslint-disable-next-line no-console
  console.log(
    `[email] status-change to=${payload.to} order=${payload.orderId} from="${payload.previousStatus}" to="${payload.nextStatus}"`,
  );
};

export default sendOrderStatusChangedEmail;
