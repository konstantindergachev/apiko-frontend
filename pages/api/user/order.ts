import { parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { IAccountResponse, IAccountResponseError } from '@/interfaces/responses';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (
  req: NextApiRequest,
  res: NextApiResponse<IAccountResponse | IAccountResponseError>
) => {
  try {
    let cookie;
    let token;
    if (req.headers.cookie) {
      cookie = parse(req.headers.cookie);
      token = cookie.token;
    }

    const response = await fetch(`${process.env.API_URL}/orders`, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (data.statusCode === 404) {
      return res.status(data.statusCode).json({ message: data.message });
    }

    return res.status(200).json({ message: data.message, order: data.order });
  } catch (error: any) {
    const status = 500;
    res.status(status).json({ message: error.message });
  }
};
