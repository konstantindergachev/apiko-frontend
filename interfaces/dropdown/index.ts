import { SetterOrUpdater } from 'recoil';

export interface IDropDown {
  user: {
    fullname: string;
    email: string;
  };
  setUsername: SetterOrUpdater<{ fullname: string; email: string }>;
}
