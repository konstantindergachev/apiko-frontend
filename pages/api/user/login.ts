import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { ILogin, IResponse, IResponseError } from '@/interfaces/responses';
import * as http from '@/utils/fetch';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { API_URL, TOKEN_NAME, MAX_AGE, NODE_ENV } = process.env;
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    const data = await http.post<ILogin, IResponse & IResponseError>(
      `${API_URL}/auth/login`,
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
        serialize(TOKEN_NAME ? TOKEN_NAME : 'apiko', data.token, {
          maxAge: Number(MAX_AGE),
          expires: new Date(Date.now() + Number(MAX_AGE) * 1000),
          httpOnly: true,
          secure: NODE_ENV === 'production',
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
