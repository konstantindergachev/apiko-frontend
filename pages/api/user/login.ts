import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { IResponse, IResponseError } from '@/interfaces/responses';
import * as http from '../../../utils/fetch';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse<IResponse | IResponseError>) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    const data = await http.post<{ email: string; password: string }, IResponse & IResponseError>(
      `${process.env.API_URL}/auth/login`,
      req.body,
      { headers }
    );

    if (data.statusCode === 404) {
      return res.status(data.statusCode).json({ message: data.message });
    }
    if (data.statusCode === 400) {
      return res.status(data.statusCode).json({ message: data.message });
    }

    if (data.token) {
      res.setHeader(
        'Set-Cookie',
        serialize('token', data.token, {
          maxAge: 28800,
          expires: new Date(Date.now() + 28800 * 1000),
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          sameSite: 'strict',
        })
      );
    }

    return res.status(200).json({ account: data.account });
  } catch (error: any) {
    const status = 500;
    res.status(status).json({ message: error.message });
  }
};
