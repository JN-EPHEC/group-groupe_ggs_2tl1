import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import type { Product as ProductModel } from "../types/product";

function Product() {
  const [products, setProducts] = useState<ProductModel[]>([]);

  useEffect(() => {
    getProducts()
      .then((result) => {
        setProducts(result);
      })
      .catch((error) => {
        console.error("Erreur lors de la recuperation des produits:", error);
      });
  }, []);

  return (
    <main className="bg-white text-black min-h-[70vh] px-6 md:px-10 py-10">
      <section className="max-w-7xl mx-auto">
        <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-3">
          Catalogue
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-normal mb-8">
          Tous les produits
        </h1>

        <div className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
          <p className="text-sm text-gray-700 mb-4">
            Connexion API en place via Axios. Produits charges: {products.length}
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            {products.slice(0, 5).map((product) => (
              <li key={product.id}>
                {product.name} - {product.price} EUR
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default Product;