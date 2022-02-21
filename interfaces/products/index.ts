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
  favofite: boolean;
  created_at: string;
  category: ICategory;
}
export interface IProducts {
  products: IProduct[];
}
