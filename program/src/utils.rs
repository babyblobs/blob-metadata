use anchor_lang::prelude::*;
use solana_program::{program_memory::sol_memcmp, pubkey::PUBKEY_BYTES};

use crate::errors::BlobExtensionError;

pub fn cmp_pubkeys(a: &Pubkey, b: &Pubkey) -> bool {
    sol_memcmp(a.as_ref(), b.as_ref(), PUBKEY_BYTES) == 0
}

pub fn assert_keys_equal(key1: Pubkey, key2: Pubkey) -> Result<()> {
    if !cmp_pubkeys(&key1, &key2) {
        err!(BlobExtensionError::PublicKeyMismatch)
    } else {
        Ok(())
    }
}
