export interface Product {
  id: number | string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  category_id?: number;
  image?: string;
  stock?: number;
}

