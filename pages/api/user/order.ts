import { parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { IAccountResponse, IAccountResponseError } from '@/interfaces/responses';
import * as http from '@/utils/fetch';
import { IBasketBody } from '@/interfaces/basket';
import { IOrderServerResponse } from '@/interfaces/api/intex';
// eslint-disable-next-line import/no-anonymous-default-export
export default async (
  req: NextApiRequest,
  res: NextApiResponse<IAccountResponse | IAccountResponseError>
) => {
  const { API_URL } = process.env;
  try {
    let cookie;
    let token;
    if (req.headers.cookie) {
      cookie = parse(req.headers.cookie);
      token = cookie.apiko;
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const data = await http.post<IBasketBody, IOrderServerResponse>(`${API_URL}/orders`, req.body, {
      headers,
    });

    return res.status(200).json({ message: data.message, order: data.order });
  } catch (error: any) {
    const status = 500;
    res.status(status).json({ message: error.message });
  }
};
