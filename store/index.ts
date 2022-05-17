import { atom, selector } from 'recoil';

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
