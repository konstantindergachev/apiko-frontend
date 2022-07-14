export interface IProductsError {
  message?: string;
}

export interface ICategory {
  id: number;
  name: string;
}
export interface IProduct {
  id: number;
  title: string;
  price: string;
  picture: string;
  description: string;
  favorite: boolean;
  created_at?: string;
  category: ICategory;
  quantity: number;
}
export interface IProducts extends IProductsError {
  products: IProduct[];
}
export interface IOneProduct {
  product: {
    id: number;
    title: string;
    price: string;
    picture: string;
    description: string;
    favorite: boolean;
    category: ICategory;
    quantity: number;
  };
}

export interface ILoadMoreSettings {
  offset: number;
  limit: number;
  sortBy: string;
}
