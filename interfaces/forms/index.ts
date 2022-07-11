export interface IAccount {
  handleAccount: (isAccount: boolean) => () => void; //MouseEventHandler<HTNLButtonElement>
}

export interface IInfoFields {
  fullname: string;
  phone: string;
  country?: string;
  city?: string;
  address?: string;
}

export interface IInput {
  [index: string]: string;
}
