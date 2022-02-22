export interface IAccount {
  handleAccount: (isAccount: boolean) => () => void; //MouseEventHandler<HTNLButtonElement>
}

export interface IFields {
  email: string;
  password: string;
}
