import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader(
    'Set-Cookie',
    serialize('token', req.cookies.token, {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
      path: '/',
      sameSite: 'strict',
    })
  );

  res.status(205).json({ success: true, message: 'No content, refresh' });
};
