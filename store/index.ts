import { atom, selector } from 'recoil';
import { IProduct } from '@/interfaces/products';

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
