import { IProduct } from '../orders';

export interface IOrder {
  id: number;
  total: number;
  items: {
    quantity: number;
    orderedPrice: number;
    product: IProduct;
  }[];
  shipment: {
    fullname: string;
    phone: string;
    country: string;
    city: string;
    address: string;
  };
  user: { id: number };
}

export interface IOrderServerResponse {
  message: string;
  order: IOrder;
}
