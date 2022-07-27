import { parse, serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import * as http from '@/utils/fetch';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { API_URL, TOKEN_NAME, NODE_ENV } = process.env;
  let cookie;
  let token;
  if (req.headers.cookie) {
    cookie = parse(req.headers.cookie);
    token = cookie.token;
  }
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  const data = await http.get<{ message: string }>(`${API_URL}/auth/logout`, {
    headers,
  });

  res.setHeader(
    'Set-Cookie',
    serialize(TOKEN_NAME ? TOKEN_NAME : 'apiko', req.cookies.apiko, {
      maxAge: 0,
      httpOnly: true,
      secure: NODE_ENV == 'production',
      path: '/',
      sameSite: 'strict',
    })
  );

  res.status(200).json({ success: true, message: data.message });
};
