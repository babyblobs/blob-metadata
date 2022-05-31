mod constants;
mod errors;
mod processor;
mod state;
mod utils;

use anchor_lang::prelude::*;
use processor::*;
use state::*;

declare_id!("BLoBXGoEp1KmFcYNbzFeq9KaFyrqy4A1HH55ceA19qLW");

#[program]
pub mod blob_metadata {
    use super::*;

    pub fn initialize_extension_manager(ctx: Context<InitializeExtensionManager>) -> Result<()> {
        handle_initialize_extension_manager(ctx)
    }

    pub fn initialize_extension_metadata(
        ctx: Context<InitializeExtensionMetadata>,
        nickname: Option<String>,
    ) -> Result<()> {
        handle_initialize_extension_metadata(ctx, nickname)
    }

    pub fn update_nickname(ctx: Context<UpdateNickname>, nickname: Option<String>) -> Result<()> {
        handle_update_nickname(ctx, nickname)
    }

    pub fn update_as_authority(
        ctx: Context<UpdateAsAuthority>,
        data: ExtensionMetadataData,
    ) -> Result<()> {
        handle_update_as_authority(ctx, data)
    }

    pub fn lose_life(ctx: Context<LoseLife>) -> Result<()> {
        handle_lose_life(ctx)
    }

    pub fn feed(ctx: Context<Feed>) -> Result<()> {
        handle_feed(ctx)
    }
}
