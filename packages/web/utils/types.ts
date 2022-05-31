export type JsonMetadata = {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: number;
  image: string;
  animation_url: string;
  external_url: string;
  mint_id: string;
  attributes: Attribute[];
  collection: Collection;
  properties: Properties;
};

export type Attribute =
  | {
      trait_type: string;
      value: number;
      max_value: number;
    }
  | {
      trait_type: string;
      value: string;
    };

export type Collection = {
  name: 'Baby Blobs Gen #1';
  family: 'Baby Blobs';
};

export type Properties = {
  files: [
    {
      uri: string;
      type: 'image/png';
    },
  ];
  category: 'html';
  creators: [
    {
      address: '6rdyFpbDoLUp7xJ3RRwxoNA6qia1PFv6pR8XscaDSGxe';
      share: 25;
    },
    {
      address: '9Zciu3YUp2cFjir4aXs75iPZMqqDndcq8JgfodwkTTW7';
      share: 25;
    },
    {
      address: 'E1swQRTDMQ3rukARV484JMBAWqqRyGLoTm8UKfCUd9Za';
      share: 25;
    },
    {
      address: 'DNLYTU56dysF78JCyAQpA6ZvWXqBtYEso8pdnVhmNdhK';
      share: 25;
    },
  ];
};
