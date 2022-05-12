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
  created_at: string;
  category: ICategory;
}
export interface IProducts {
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
  };
}

export interface ILoadMoreSettings {
  offset: number;
  limit: number;
  sortBy: string;
}
