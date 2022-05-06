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
