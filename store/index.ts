import { atom, selector } from 'recoil';

export const baseUsername = atom({
  key: 'baseUsername',
  default: { fullname: '' },
});

export const selectUsername = selector({
  key: 'selectUsername',
  get: ({ get }) => {
    const { fullname } = get(baseUsername);
    return fullname;
  },
});
