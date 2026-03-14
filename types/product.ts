export type ProductCategory = "fisico" | "digital";
export type ProductCurrency = "BRL" | "USD";
export type ProductStatus = "em_estoque" | "vendido";

export interface Product {
  id: string;
  name: string;
  tag: string;
  costPrice: number;
  salePrice: number;
  currency: ProductCurrency;
  quantity: number;
  category: ProductCategory;
  status: ProductStatus;
  createdAt: string;
}
