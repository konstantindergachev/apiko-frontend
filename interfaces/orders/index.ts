export interface IOrder {
  order: {
    id: number;
    total: number;
    created_at: Date;
    items: {
      quantity: number;
      orderedPrice?: number;
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
    products: IProduct[];
    user: { id: number };
  };
}

export interface IItemOrder {
  productId?: number;
  quantity: number;
  orderedPrice?: number;
  product: IProduct;
}

export interface IProduct {
  id: number;
  title: string;
  price: number;
  picture: string;
  description: string;
  favorite: boolean;
  created_at: Date;
}
