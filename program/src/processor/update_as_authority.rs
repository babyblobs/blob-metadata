use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

use crate::{
    errors::BlobExtensionError,
    state::{ExtensionManager, ExtensionMetadata, ExtensionMetadataData, Metadata},
};

#[derive(Accounts)]
pub struct UpdateAsAuthority<'info> {
    #[account(mut, seeds=[ExtensionMetadata::PREFIX.as_bytes(), metadata.mint.key().as_ref(), collection_mint.key().as_ref()], bump)]
    pub extension_metadata: Account<'info, ExtensionMetadata>,
    #[account(mut)]
    pub update_authority: Signer<'info>,

    #[account(has_one = collection_mint)]
    pub extension_manager: Account<'info, ExtensionManager>,
    pub collection_mint: Account<'info, Mint>,

    #[account(has_one = update_authority)]
    pub metadata: Account<'info, Metadata>,
}

pub fn handle_update_as_authority(
    ctx: Context<UpdateAsAuthority>,
    data: ExtensionMetadataData,
) -> Result<()> {
    let extension_metadata = &mut ctx.accounts.extension_metadata;
    let collection_mint = &ctx.accounts.collection_mint;
    let metadata = &ctx.accounts.metadata;

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

    if let Some(nickname) = &data.nickname {
        if nickname.len() > 32 {
            return err!(BlobExtensionError::NicknameTooLong);
        }
    }

    extension_metadata.extension_data = data;
    Ok(())
}
