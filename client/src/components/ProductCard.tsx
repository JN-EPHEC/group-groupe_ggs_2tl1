import type { Product } from "../types/product";

const PRICE_FORMATTER = new Intl.NumberFormat("fr-BE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatPrice(price: number) {
  return PRICE_FORMATTER.format(price);
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group border border-gray-200 bg-white rounded-sm overflow-hidden">
      <div className="relative aspect-[3/4] bg-[#f2f0ec]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] tracking-widest uppercase text-gray-500">
            Placeholder image
          </div>
        )}

        {product.stock === 0 && (
          <span className="absolute top-3 left-3 text-[9px] tracking-widest uppercase bg-black text-white px-2 py-1">
            Rupture
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm text-black mb-1">{product.name}</p>
        <p className="text-sm text-gray-500 mb-2">{product.category ?? "Non classé"}</p>
        <p className="text-sm font-medium text-black">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}

export default ProductCard;

