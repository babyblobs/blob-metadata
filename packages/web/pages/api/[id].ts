// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

const URI_PREFIX = 'https://baby-blobs.s3.us-east-2.amazonaws.com/json/';

const get_uri = (id: number): string => {
  return `${URI_PREFIX}${id.toString()}.json`;
};

async function getJsonMetadata(id: string) {
  try {
    const idNum = parseInt(id);
    const result = await fetch(get_uri(idNum));
    return await result.json();
  } catch (e) {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  console.log(id);
  console.log(typeof id);
  if (typeof id === 'string') {
    const json = await getJsonMetadata(id);
    if (json === null) {
      res.status(404).send(null);
    } else {
      res.status(200).json(json);
    }
  } else {
    res.status(404).send(null);
  }
}
