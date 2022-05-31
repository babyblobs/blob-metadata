import { PublicKey } from '@solana/web3.js';
import { PROGRAM_ADDRESS } from 'blob-metadata';
import { PROGRAM_ADDRESS as TOKEN_METADATA_ID } from '@metaplex-foundation/mpl-token-metadata';

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
