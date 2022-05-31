use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};

use crate::{
    constants::{HUNGRY_TIME, STARVING_TIME},
    errors::BlobExtensionError,
    state::{ExtensionManager, ExtensionMetadata, Metadata},
    utils::assert_keys_equal,
};

#[derive(Accounts)]
pub struct Feed<'info> {
    #[account(mut, seeds=[ExtensionMetadata::PREFIX.as_bytes(), mint.key().as_ref(), collection_mint.key().as_ref()], bump)]
    pub extension_metadata: Account<'info, ExtensionMetadata>,
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(has_one = collection_mint)]
    pub extension_manager: Account<'info, ExtensionManager>,
    pub collection_mint: Account<'info, Mint>,

    #[account(has_one = mint)]
    pub metadata: Account<'info, Metadata>,
    #[account(has_one = mint, constraint = token.amount == 1)]
    pub token: Account<'info, TokenAccount>,
    pub mint: Account<'info, Mint>,
}

pub fn handle_feed(ctx: Context<Feed>) -> Result<()> {
    let extension_metadata = &mut ctx.accounts.extension_metadata;
    let extension_data = &mut extension_metadata.extension_data;
    let payer = &mut ctx.accounts.payer;
    let collection_mint = &ctx.accounts.collection_mint;
    let metadata = &ctx.accounts.metadata;
    let token = &ctx.accounts.token;

    match &metadata.collection {
        Some(collection) => {
            if !collection.verified {
                return err!(BlobExtensionError::UnverifiedCollection);
            }
            if collection.key != collection_mint.key() {
                return err!(BlobExtensionError::CollectionMismatch);
            }
        }
        None => return err!(BlobExtensionError::MissingCollection),
    }

    if payer.key() != metadata.update_authority {
        assert_keys_equal(token.owner, payer.owner.key())?;
    }

    let current_timestamp = Clock::get()?.unix_timestamp;

    let time_since_last_fed = current_timestamp - extension_data.last_fed;
    if time_since_last_fed > HUNGRY_TIME {
        if time_since_last_fed < HUNGRY_TIME * 2 {
            msg!("Feeding your blob and increasing your feed streak! :)");
            extension_data.last_fed = current_timestamp;
            extension_data.feed_streak += 1;
            if extension_data.feed_streak % 20 == 0 {
                msg!("Amazing feed streak! Here's another life! :D");
                extension_data.lives += 1;
            }
        } else {
            if time_since_last_fed < STARVING_TIME {
                msg!("Feeding your blob and resetting your feed streak! :/");
            } else {
                msg!("Your blob was starving! Feeding it now! Since no one caught you harming your blob, resetting your feed streak is your only punishment.");
            }
            extension_data.last_fed = current_timestamp;
            extension_data.feed_streak = 0;
        }
    } else {
        msg!("Your blob is full!");
        return err!(BlobExtensionError::BlobIsFull);
    }

    Ok(())
}
