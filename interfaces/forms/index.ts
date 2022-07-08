export interface IAccount {
  handleAccount: (isAccount: boolean) => () => void; //MouseEventHandler<HTNLButtonElement>
}

export interface ILoginFields {
  email: string;
  password: string;
}

export interface IInfoFields {
  fullname: string;
  phone: string;
  country?: string;
  city?: string;
  address?: string;
}

export interface IChangePasswordFields {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IInput {
  [index: string]: string;
}
