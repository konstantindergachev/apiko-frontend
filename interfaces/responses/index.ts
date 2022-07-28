interface IUser {
  id: number;
  fullname: string;
  email: string;
  user?: { id: number };
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  password_confirm: string;
}

export interface IResponse {
  account: IUser;
  token?: string;
}

export interface IResponseError {
  statusCode?: number;
  message: string;
}

export interface IProductsByCategory {
  id: number;
  title: string;
  price: string;
  picture: string;
  description: string;
  favorite: true;
  created_at: string;
  category: { id: number; name: string };
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

export interface IEditAccountInfo {
  id: 5;
  fullname: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  email: string;
}

export interface IEditAccountNewPassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IAccountResponseError {
  message: string;
}
