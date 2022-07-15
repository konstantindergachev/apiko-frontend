import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { IResponse, IResponseError } from '@/interfaces/responses';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse<IResponse | IResponseError>) => {
  try {
    const response = await fetch(`${process.env.API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.statusCode === 404) {
      return res.status(data.statusCode).json({ message: data.message });
    }
    if (data.statusCode === 400) {
      return res.status(data.statusCode).json({ message: data.message });
    }

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

    return res.status(200).json({ account: data.account });
  } catch (error: any) {
    const status = 500;
    res.status(status).json({ message: error.message });
  }
};
