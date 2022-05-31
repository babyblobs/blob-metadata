import { Connection, PublicKey } from '@solana/web3.js';
import { findExtensionMetadata } from './program';
import { ExtensionMetadata } from 'blob-metadata';
import { Attribute, JsonMetadata } from './types';

export const URI_PREFIX = 'https://baby-blobs.s3.us-east-2.amazonaws.com/json/';
const COLLECTION_MINT = new PublicKey('94DVUnq5TgZtY3K9atnxxfdHBQjCtCAdjzWUNtZWZERm');
const RPC = 'http://127.0.0.1:8899';
const solConnection = new Connection(RPC, 'confirmed');

export const get_uri = (id: number): string => {
  return `${URI_PREFIX}${id.toString()}.json`;
};

export async function getJsonMetadata(id: string): Promise<JsonMetadata> {
  const idNum = parseInt(id);
  const result = await fetch(get_uri(idNum));
  if (result.ok) {
    const resultJson = await result.json();
    return await getExtensionMetadata(resultJson);
  } else {
    throw new Error(result.status.toString());
  }
}

export async function getExtensionMetadata(json: JsonMetadata) {
  const externalMintId = json.mint_id;
  const mintId = mint_id_map[externalMintId];
  const mintPubkey = new PublicKey(mintId);
  const extensionMetadataPubkey = findExtensionMetadata(COLLECTION_MINT, mintPubkey)[0];
  try {
    const { extensionData } = await ExtensionMetadata.fromAccountAddress(
      solConnection,
      extensionMetadataPubkey,
    );
    if (extensionData.nickname !== null) {
      const nicknameAttribute: Attribute = {
        trait_type: 'Nickname',
        value: extensionData.nickname,
      };
      json.attributes.push(nicknameAttribute);
    }

    const livesAttribute: Attribute = {
      trait_type: 'Lives',
      value: extensionData.lives.toString(),
    };
    json.attributes.push(livesAttribute);

    const streakAttribute: Attribute = {
      trait_type: 'Feed Streak',
      value: extensionData.feedStreak.toString(),
    };
    json.attributes.push(streakAttribute);

    const lastFed = extensionData.lastFed;
    let lastFedDate;

    if (typeof lastFed === 'number') {
      lastFedDate = new Date(lastFed * 1000).toDateString();
    } else {
      lastFedDate = new Date(lastFed.toNumber() * 1000).toDateString();
    }

    json.attributes.push({
      trait_type: 'Last Fed',
      value: lastFedDate,
    });

    return json;
  } catch {
    return json;
  }
}

const mint_id_map: { [id: string]: string } = {
  '5jdWiA95CCY7aBLstqwgZKQHaRDPgiF3cpiJytuAbtmr': 'FsCW3EbYEtWD4g59dcp8KXfQXbqoTyx4jiwFQ95bKiSB',
  Cge4k3H5eHSSJyB8QH1wJMcFZ7Tv4pEp8cwpBk5eHyCt: '6mHmpyBkpddbrYP2jXCQbz5LMmi2jgUU3bYBpMgy693f',
  HoAaUC2duiGo4YCKCR2CDgbfqn2nV8xXurGsy62o7aLG: 'xDWE5kg7PACSoJSCD7dErftVHd3MvcwR5BXtoWAVk4E',
  G4xmt32tpW4x6PZKqEdik4McdRTsQfaZbfTDuAhjEjjG: '7ouLhV3jF9WuAjVkaVYvAomx3ohUTPPoASByssLRfoyC',
  BaLtaUBicYk16aw5GdbHGXhWnr9yP76jFXBd45RpffGU: '5Vb5QLmwVi9tjmVVCtMSsRwyXmSKsFg2bR18Uru8qxf7',
  A6VPm7j5u7LKZXR7HcsddwUD7RLGV99rNYGSR6ERSLGB: 'GivPhX5MYrHU1bdit58fB8AHB3J4ArbrScu7EBzTA7QE',
  B8D8kjMFzTx24ReNKbYMmfRdjrCY8hPzfDSvi6CPek2m: '2LqXJhLiNDe5PPBrnbWcyuHVG9bhNcBKnEdsBNKXNSEn',
  '2MKcFyf2qve1freSqqr7AWCWTKSSAw8AX2jxZxNrCR4y': '6Lv3gioeMbczmyreTyY88xeXzrB3rZpD6eQhhp2B8Syu',
  BkBAKuTG16Jr7hNNpZ2XtfK5zHXzNNu9twwd8VqJ1KYY: '5BbdU8sGo1DqeL9AdhZvHiwNhsickCxJ72Y7xHndrgdq',
  BAWF9bPiP7dZVoqMbCrDLLH1aQqRt5c9pM2CfH2RYiXS: '9fzMS4fFfXcCrjPVecQfX6yWpHFNrvchdnb5E1bSAkig',
};
