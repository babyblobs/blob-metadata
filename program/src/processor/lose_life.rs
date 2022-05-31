use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

use crate::{constants::STARVING_TIME, errors::BlobExtensionError, state::ExtensionMetadata};

#[derive(Accounts)]
pub struct LoseLife<'info> {
    #[account(mut, seeds=[ExtensionMetadata::PREFIX.as_bytes(), mint.key().as_ref(), collection_mint.key().as_ref()], bump)]
    pub extension_metadata: Account<'info, ExtensionMetadata>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub collection_mint: Account<'info, Mint>,
    pub mint: Account<'info, Mint>,
}

pub fn handle_lose_life(ctx: Context<LoseLife>) -> Result<()> {
    let extension_metadata = &mut ctx.accounts.extension_metadata;
    let extension_data = &mut extension_metadata.extension_data;
    let current_timestamp = Clock::get()?.unix_timestamp;

    if current_timestamp - extension_data.last_fed > STARVING_TIME {
        extension_data.lives = extension_data.lives.saturating_sub(1);
        extension_data.last_fed = current_timestamp;
        extension_data.feed_streak = 0;
        msg!("This Blob is starving! Decreasing a life, resetting the feed streak, and feeding it!")
    } else {
        msg!("The Blob isn't starving yet!");
        return err!(BlobExtensionError::BlobNotStarving);
    }

    Ok(())
}
