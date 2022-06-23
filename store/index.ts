import { atom, selector } from 'recoil';
import { IProduct } from '@/interfaces/products';
import { IFavorite } from '@/interfaces/favorites';
import { IOrder } from '@/interfaces/orders';

export const baseUsername = atom({
  key: 'baseUsername',
  default: { id: 0, fullname: '', email: '' },
});

export const selectUsername = selector({
  key: 'selectUsername',
  get: ({ get }) => {
    const user = get(baseUsername);
    return user;
  },
});

export const baseProduct = atom({
  key: 'baseProduct',
  default: { id: 0, count: 0 },
});

export const selectProduct = selector({
  key: 'selectProduct',
  get: ({ get }) => {
    return get(baseProduct);
  },
});

export const baseBasket = atom({
  key: 'baseBasket',
  default: [] as IProduct[],
});

export const selectBasket = selector({
  key: 'selectBasket',
  get: ({ get }) => {
    return get(baseBasket);
  },
});

export const baseFavorites = atom({
  key: 'baseFavorites',
  default: [] as IFavorite[],
});

export const selectFavorites = selector({
  key: 'selectFavorites',
  get: ({ get }) => {
    return get(baseFavorites);
  },
});

export const baseOrder = atom({
  key: 'baseOrder',
  default: {} as IOrder,
});

export const selectOrder = selector({
  key: 'selectOrder',
  get: ({ get }) => {
    return get(baseOrder);
  },
});
