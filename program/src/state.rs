use std::ops::Deref;

use anchor_lang::prelude::*;
use mpl_token_metadata::{
    state::{MAX_METADATA_LEN, MAX_NAME_LENGTH},
    utils::try_from_slice_checked,
};

use crate::constants::STARTING_LIVES;

/// Extension manager account
#[account]
#[derive(Debug)]
pub struct ExtensionManager {
    pub collection_mint: Pubkey,
}

impl ExtensionManager {
    pub const LEN: usize = 8 + 32;
    pub const PREFIX: &'static str = "manager";
}

#[account]
#[derive(Debug)]
pub struct ExtensionMetadata {
    pub collection_mint: Pubkey,
    pub mint: Pubkey,
    pub extension_data: ExtensionMetadataData,
}

impl ExtensionMetadata {
    pub const LEN: usize = 8 +
        32 + // collection mint
        32 + // mint
        1 + MAX_NAME_LENGTH + // nickname
        1 + 1 + // lives
        1 + 8 + // last fed
        100 // for remaining data before resizing is live
    ;
    pub const PREFIX: &'static str = "metadata";

    pub fn new(collection_mint: Pubkey, mint: Pubkey, nickname: Option<String>) -> Self {
        ExtensionMetadata {
            collection_mint,
            mint,
            extension_data: ExtensionMetadataData::new(nickname),
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct ExtensionMetadataData {
    pub nickname: Option<String>,
    pub lives: Option<u8>,
    pub last_fed: Option<i64>,
    pub other_info: RemainingDataTypes,
}
impl ExtensionMetadataData {
    pub fn new(nickname: Option<String>) -> Self {
        ExtensionMetadataData {
            nickname,
            lives: Some(STARTING_LIVES),
            last_fed: None,
            other_info: RemainingDataTypes::None,
        }
    }
}

#[non_exhaustive]
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub enum RemainingDataTypes {
    None,
}

impl Default for RemainingDataTypes {
    fn default() -> Self {
        RemainingDataTypes::None
    }
}

#[derive(Clone, Debug)]
pub struct Metadata(mpl_token_metadata::state::Metadata);

#[allow(dead_code)]
impl Metadata {
    pub const LEN: usize = MAX_METADATA_LEN;
}

impl AccountDeserialize for Metadata {
    fn try_deserialize_unchecked(buf: &mut &[u8]) -> Result<Self> {
        try_from_slice_checked(
            buf,
            mpl_token_metadata::state::Key::MetadataV1,
            MAX_METADATA_LEN,
        )
        .map(Metadata)
        .map_err(|e| e.into())
    }
}

impl Owner for Metadata {
    fn owner() -> Pubkey {
        mpl_token_metadata::ID
    }
}

impl Deref for Metadata {
    type Target = mpl_token_metadata::state::Metadata;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl AccountSerialize for Metadata {}
