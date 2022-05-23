import { Keypair, PublicKey } from '@solana/web3.js';
import { PROGRAM_ADDRESS } from 'blob-metadata/dist/generated';
import fs from 'fs';
import log from 'loglevel';
import bs58 from 'bs58';

export async function find_extension_manager(collection_mint: PublicKey) {
  const seeds = [new Buffer('manager'), collection_mint.toBuffer()];
  return PublicKey.findProgramAddress(seeds, new PublicKey(PROGRAM_ADDRESS));
}

export async function find_metadata_manager(collection_mint: PublicKey) {
  const seeds = [new Buffer('manager'), collection_mint.toBuffer()];
  return PublicKey.findProgramAddress(seeds, new PublicKey(PROGRAM_ADDRESS));
}

export function loadWalletKey(keypair): Keypair {
  if (!keypair || keypair == '') {
    throw new Error('Keypair is required!');
  }

  const decodedKey = new Uint8Array(
    keypair.endsWith('.json') && !Array.isArray(keypair)
      ? JSON.parse(fs.readFileSync(keypair).toString())
      : bs58.decode(keypair),
  );

  const loaded = Keypair.fromSecretKey(decodedKey);
  log.info(`wallet public key: ${loaded.publicKey}`);
  return loaded;
}
