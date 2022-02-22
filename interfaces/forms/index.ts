export interface IAccount {
  handleAccount: (isAccount: boolean) => () => void; //MouseEventHandler<HTNLButtonElement>
}

export interface ILoginFields {
  email: string;
  password: string;
}

export interface IRegistrationFields {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  password_confirm: string;
}
