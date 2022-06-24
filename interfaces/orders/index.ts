export interface IOrder {
  id: number;
  total: number;
  created_at: Date;
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
}
