import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { IEditAccountNewPassword, IResponse, IResponseError } from '@/interfaces/responses';
import * as http from '@/utils/fetch';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse<IResponse | IResponseError>) => {
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
    const data = await http.put<IEditAccountNewPassword, IResponseError>(
      `${API_URL}/account/password`,
      req.body,
      {
        headers,
      }
    );

    if (data.statusCode === 404) {
      return res.status(data.statusCode).json({ message: data.message });
    }

    return res.status(200).json({ message: data.message });
  } catch (error: any) {
    const status = 500;
    res.status(status).json({ message: error.message });
  }
};
