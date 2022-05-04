interface IUser {
  id: number;
  fullname: string;
  email: string;
  user?: { id: number };
}

export interface IResponse {
  account: IUser;
  token?: string;
}

export interface IResponseError {
  message: string;
}

interface IProductsByCategory {
  id: number;
  title: string;
  price: string;
  picture: string;
  description: string;
  favorite: true;
  created_at: string;
  category: { id: number; name: string };
}
export interface IProductsByCategoryResponse {
  products: IProductsByCategory[];
}
export interface IProductsByCategoryResponseError {
  message: string;
}
