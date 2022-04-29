import { atom, selector } from 'recoil';

export const baseUsername = atom({
  key: 'baseUsername',
  default: { fullname: '', email: '' },
});

export const selectUsername = selector({
  key: 'selectUsername',
  get: ({ get }) => {
    const user = get(baseUsername);
    return user;
  },
});
