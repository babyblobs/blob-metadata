use anchor_lang::prelude::*;

#[error_code]
pub enum BlobExtensionError {
    #[msg("NFT metadata doesn't have a collection")]
    MissingCollection,
    #[msg("NFT collection doesn't match the collection manager collection!")]
    CollectionMismatch,
    #[msg("NFT collection isn't verified!")]
    UnverifiedCollection,
    #[msg("Public key mismatch")]
    PublicKeyMismatch,
    #[msg("Nickname can't be longer than 32 characters!")]
    NicknameTooLong,
}
