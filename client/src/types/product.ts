export interface Product {
  id: number | string;
  name: string;
  price: number;
  category?: string;
  image?: string;
  stock?: number;
}

