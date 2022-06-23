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

export interface IProductFavoriteResponse {
  message: string;
}

export interface IProductFavoriteResponseError {
  message: string;
}

export interface IAccountResponse {
  message: string;
  order: {
    id: number;
    total: number;
    items: {
      quantity: number;
      orderedPrice: number;
      product: {
        id: number;
        title: string;
        price: number;
        picture: string;
        description: string;
        favorite: boolean;
        created_at: Date;
      };
    }[];
    shipment: {
      fullname: string;
      phone: string;
      country: string;
      city: string;
      address: string;
    };
    user: { id: number };
  };
}

export interface IAccountResponseError {
  message: string;
}
