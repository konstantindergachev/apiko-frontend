import { IFavorite } from '@/interfaces/favorites';
import { IProduct } from '@/interfaces/products';

export const numberFormat = (numb: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numb);
};

export const dateFormat = (date: Date): string => {
  const _date = new Date(date);
  return new Intl.DateTimeFormat('en-US').format(_date);
};

export const takeFirstWord = (str: string): string => {
  return str.split(' ')[0];
};

export const takeFirstChar = (str: string): string => {
  return str
    .split(' ')
    .map((word) => word.charAt(0))
    .join('');
};

export const addFavoritesToAll = (products: IProduct[], favorites: IFavorite[]): IProduct[] => {
  const productsWithFavorites = products.map((product: IProduct) => {
    favorites.forEach((favorite) => {
      if (product.id === favorite.product.id) {
        product.favorite = true;
      }
    });
    return product;
  });
  return productsWithFavorites;
};
