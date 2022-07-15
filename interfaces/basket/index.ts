import { IInput } from '../forms';
import { IOrder } from '../orders';

export interface IBasketProduct {
  productId: number;
  quantity: number;
}

export interface IBasketBody {
  items: IBasketProduct[];
  shipment: IInput;
}

export interface IOrderResponse {
  message: string;
  order: IOrder;
}
