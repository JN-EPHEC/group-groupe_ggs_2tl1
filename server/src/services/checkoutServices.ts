import Stripe from "stripe";
import prisma from "../config/prisma.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

type CheckoutItemInput = {
  product_id: number;
  quantity: number;
};

type CheckoutInput = {
  items: CheckoutItemInput[];
};

export const createCheckoutSessionService = async (input: CheckoutInput) => {
  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw new Error("EMPTY_CART");
  }

  const parsedItems = input.items.map((item) => ({
    product_id: Number(item.product_id),
    quantity: Number(item.quantity),
  }));

  const invalidItem = parsedItems.find(
    (item) =>
      !Number.isInteger(item.product_id) ||
      item.product_id <= 0 ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
  );

  if (invalidItem) {
    throw new Error("EMPTY_CART");
  }

  const productIds = parsedItems.map((item) => item.product_id);

  const products = await prisma.products.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  if (products.length !== new Set(productIds).size) {
    throw new Error("PRODUCTS_NOT_FOUND");
  }

  const productById = new Map(products.map((product) => [product.id, product]));

  const lineItems = parsedItems.map((item) => {
    const product = productById.get(item.product_id);

    if (!product) {
      throw new Error("PRODUCTS_NOT_FOUND");
    }

    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: product.name,
          description: product.description,
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: item.quantity,
    };
  });
  const clientUrl = process.env.CLIENT_URL;

  if (!clientUrl) {
    throw new Error("CLIENT_URL_MISSING");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/panier`,
  });

  return {
    url: session.url,
  };
};
