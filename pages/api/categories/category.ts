import { NextApiRequest, NextApiResponse } from 'next';
import { IProductsByCategory, IResponseError } from '@/interfaces/responses';
import * as http from '@/utils/fetch';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { API_URL } = process.env;
  try {
    const data = await http.get<IProductsByCategory[] & IResponseError>(
      `${API_URL}/categories/${req.query.categoryId}`
    );
    if (data.statusCode === 404) {
      return res.status(data.statusCode).json({ message: data.message });
    }

    return res.status(200).json({ products: data });
  } catch (error: any) {
    const status = 500;
    res.status(status).json({ message: error.message });
  }
};
