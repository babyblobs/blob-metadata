// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getJsonMetadata } from '../../utils/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const error = () => {
    res.status(404).send(null);
  };
  try {
    const { id } = req.query;
    if (typeof id == 'string') {
      const json = await getJsonMetadata(id);
      res.status(200).json(json);
    } else {
      error();
    }
  } catch (e) {
    error();
  }
}
