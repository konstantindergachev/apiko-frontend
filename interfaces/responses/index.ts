interface IUser {
  id: number;
  fullname: string;
  email: string;
  user?: { id: number };
}

export interface IResponse {
  account: IUser;
  token?: string;
}

export interface IResponseError {
  message: string;
}
