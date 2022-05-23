// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

const metadata = {
  name: 'BabyBlob #8036',
  symbol: 'BABYBLOBS',
  description:
    'Baby Blobs is a collection of 8078 cute, interactive Blob NFTs living on the Solana blockchain. Owning a pet Blob gives you access to an ever-expanding Blobverse and lets you participate in exclusive events and opportunities. Some Blobs are rarer than others, and some will reveal hidden features in the future. Visit https://babyblobs.art to learn more. You can interact with your Blob by tapping using 1-5 fingers; by moving your finger or the cursor around; or by pressing J, H, R, or B.',
  seller_fee_basis_points: 250,
  image: 'https://arweave.net/Rt2tpuIHQLDvSrb_BaEyiIv7kXR6SNdA-qvjbXQoC7U/a93d04e.png',
  animation_url: 'https://arweave.net/zeUrfcAy8DSsT9zs6_iFHwDoDIKT4rdF6cPhZNWApLU/a93d04e.html',
  external_url: 'https://babyblobs.art',
  attributes: [
    {
      trait_type: 'Tier',
      value: 4,
      max_value: 4,
    },
    {
      trait_type: 'Blob Style',
      value: 'Red Panda',
    },
    {
      trait_type: 'Background',
      value: 'Red Panda',
    },
    {
      trait_type: 'Face',
      value: 'Red Panda',
    },
    {
      trait_type: 'Face Color',
      value: 'Red Panda',
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ name: 'John Doe' });
}
