use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

use crate::state::{ExtensionManager, Metadata};

#[derive(Accounts)]
pub struct InitializeExtensionManager<'info> {
    #[account(init, seeds=[ExtensionManager::PREFIX.as_bytes(), mint.key().as_ref()], bump, payer = update_authority, space = ExtensionManager::LEN)]
    pub extension_manager: Account<'info, ExtensionManager>,

    #[account(mut, has_one = mint, has_one = update_authority)]
    pub metadata: Account<'info, Metadata>,
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub update_authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handle_initialize_extension_manager(ctx: Context<InitializeExtensionManager>) -> Result<()> {
    let extension_manager = &mut ctx.accounts.extension_manager;
    let mint = &mut ctx.accounts.mint;

    extension_manager.collection_mint = mint.key();
    Ok(())
}
