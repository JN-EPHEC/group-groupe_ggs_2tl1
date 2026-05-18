import { useEffect, useMemo, useState } from "react";
import { clearCart, getCart } from "../services/cartService";

type OrderStatus = "loading" | "success" | "error" | "empty";

function CheckoutSuccess() {
  const [status, setStatus] = useState<OrderStatus>("loading");
  const [message, setMessage] = useState("Création de votre commande...");

  const sessionId = useMemo(() => {
    return new URLSearchParams(window.location.search).get("session_id");
  }, []);

  useEffect(() => {
    const createOrder = async () => {
      const cart = getCart();

      if (cart.length === 0) {
        setStatus("empty");
        setMessage("Votre panier est déjà vide.");
        return;
      }

      if (sessionId && localStorage.getItem(`order_created_${sessionId}`)) {
        setStatus("success");
        setMessage("Votre commande a déjà été confirmée.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("error");
        setMessage("Connecte-toi pour finaliser la commande.");
        return;
      }

      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cart.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
            })),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? "Impossible de créer la commande.");
        }

        if (sessionId) {
          localStorage.setItem(`order_created_${sessionId}`, "true");
        }

        clearCart();
        setStatus("success");
        setMessage("Paiement confirmé, votre commande est créée.");
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Erreur commande.");
      }
    };

    createOrder();
  }, [sessionId]);

  return (
    <main className="bg-white text-black min-h-[70vh] px-6 md:px-10 py-10">
      <section className="max-w-3xl mx-auto">
        <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-3">
          Paiement
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-normal mb-8">
          Confirmation
        </h1>

        <div className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
          <p
            className={`text-sm ${
              status === "error" ? "text-red-600" : "text-gray-700"
            }`}
          >
            {message}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/produits"
              className="inline-block px-5 py-3 text-xs tracking-widest uppercase border border-black bg-black text-white hover:opacity-70 transition-opacity"
            >
              Produits
            </a>
            {status === "error" && (
              <a
                href="/panier"
                className="inline-block px-5 py-3 text-xs tracking-widest uppercase border border-gray-300 bg-white hover:opacity-60 transition-opacity"
              >
                Retour panier
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default CheckoutSuccess;
