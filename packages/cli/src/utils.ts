import { Keypair, PublicKey } from '@solana/web3.js';
import { PROGRAM_ADDRESS } from 'blob-metadata';
import { PROGRAM_ADDRESS as TOKEN_METADATA_ID } from '@metaplex-foundation/mpl-token-metadata';
import fs from 'fs';
import log from 'loglevel';
import bs58 from 'bs58';

export function findExtensionManager(collection_mint: PublicKey) {
  const seeds = [new Buffer('manager'), collection_mint.toBuffer()];
  return PublicKey.findProgramAddressSync(seeds, new PublicKey(PROGRAM_ADDRESS));
}

export function findExtensionMetadata(collection_mint: PublicKey, mint: PublicKey) {
  const seeds = [new Buffer('metadata'), mint.toBuffer(), collection_mint.toBuffer()];
  return PublicKey.findProgramAddressSync(seeds, new PublicKey(PROGRAM_ADDRESS));
}

export function findMetadataPda(mint: PublicKey) {
  const seeds = [
    new Buffer('metadata'),
    new PublicKey(TOKEN_METADATA_ID).toBuffer(),
    mint.toBuffer(),
  ];
  return PublicKey.findProgramAddressSync(seeds, new PublicKey(TOKEN_METADATA_ID));
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
