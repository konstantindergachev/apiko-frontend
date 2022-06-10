export interface IFavorite {
  id: number;
  product: {
    id: number;
    title: string;
    price: string;
    picture: string;
    description: string;
    favorite: boolean;
    created_at?: string;
  };
}
export interface IFavorites {
  favorites: IFavorite[];
}
