import { NextApiRequest, NextApiResponse } from 'next';
import {
  IProductsByCategoryResponse,
  IProductsByCategoryResponseError,
} from '@/interfaces/responses';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (
  req: NextApiRequest,
  res: NextApiResponse<IProductsByCategoryResponse | IProductsByCategoryResponseError>
) => {
  const { API_URL } = process.env;
  try {
    const response = await fetch(`${API_URL}/categories/${req.query.categoryId}`);

    const data = await response.json();
    if (data.statusCode === 404) {
      return res.status(data.statusCode).json({ message: data.message });
    }

    return res.status(200).json({ products: data });
  } catch (error: any) {
    const status = 500;
    res.status(status).json({ message: error.message });
  }
};
