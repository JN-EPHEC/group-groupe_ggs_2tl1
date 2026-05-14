import { useEffect, useMemo, useState } from "react";
import {
  CART_UPDATED_EVENT,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
  type CartItem,
} from "../services/cartService";

const PRICE_FORMATTER = new Intl.NumberFormat("fr-BE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const refreshCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    refreshCart();
    window.addEventListener(CART_UPDATED_EVENT, refreshCart);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, refreshCart);
    };
  }, []);

  const totalPrice = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  const handleCheckout = async () => {
    setErrorMessage(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("Connecte-toi avant de passer au paiement.");
      return;
    }

    setIsCheckingOut(true);

    try {
      const response = await fetch("/api/checkout/create-session", {
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
        throw new Error(data.message ?? "Impossible de lancer le paiement.");
      }

      if (!data.url) {
        throw new Error("Stripe n'a pas renvoyé d'URL de paiement.");
      }

      window.location.href = data.url;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erreur paiement.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="bg-white text-black min-h-[70vh] px-6 md:px-10 py-10">
      <section className="max-w-4xl mx-auto">
        <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-3">
          Panier
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-normal mb-8">
          Votre panier
        </h1>

        {cart.length === 0 ? (
          <div className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
            <p className="text-sm text-gray-700 mb-6">Votre panier est vide.</p>
            <a
              href="/produits"
              className="inline-block px-5 py-3 text-xs tracking-widest uppercase border border-black bg-black text-white hover:opacity-70 transition-opacity"
            >
              Voir les produits
            </a>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <article
                  key={item.product_id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 md:items-center border-b border-gray-200 pb-4"
                >
                  <div>
                    <h2 className="text-base font-medium">{item.name}</h2>
                    <p className="text-sm text-gray-600">
                      {PRICE_FORMATTER.format(item.price)}
                    </p>
                  </div>

                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity}
                    onChange={(event) =>
                      updateCartItemQuantity(item.product_id, Number(event.target.value))
                    }
                    className="w-24 border border-gray-300 bg-white px-3 py-2 text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => removeCartItem(item.product_id)}
                    className="px-4 py-2 text-xs tracking-widest uppercase border border-gray-300 bg-white hover:opacity-60 transition-opacity"
                  >
                    Retirer
                  </button>
                </article>
              ))}
            </div>

            <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-lg font-medium">
                Total: {PRICE_FORMATTER.format(totalPrice)}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={clearCart}
                  className="px-5 py-3 text-xs tracking-widest uppercase border border-gray-300 bg-white hover:opacity-60 transition-opacity"
                >
                  Vider
                </button>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="px-5 py-3 text-xs tracking-widest uppercase border border-black bg-black text-white disabled:opacity-40 hover:opacity-70 transition-opacity"
                >
                  {isCheckingOut ? "Redirection..." : "Payer"}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Cart;
