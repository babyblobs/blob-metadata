use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};

use crate::{
    errors::BlobExtensionError,
    state::{ExtensionManager, ExtensionMetadata, Metadata},
    utils::assert_keys_equal,
};

#[derive(Accounts)]
pub struct UpdateNickname<'info> {
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

pub fn handle_update_nickname(
    ctx: Context<UpdateNickname>,
    nickname: Option<String>,
) -> Result<()> {
    let extension_metadata = &mut ctx.accounts.extension_metadata;
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

    if let Some(nickname) = &nickname {
        if nickname.len() > 32 {
            return err!(BlobExtensionError::NicknameTooLong);
        }
    }

    extension_metadata.extension_data.nickname = nickname;
    Ok(())
}
