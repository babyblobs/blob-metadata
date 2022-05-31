use anchor_lang::prelude::*;

#[error_code]
pub enum BlobExtensionError {
    #[msg("NFT metadata doesn't have a collection!")]
    MissingCollection,
    #[msg("NFT collection doesn't match the collection manager collection!")]
    CollectionMismatch,
    #[msg("NFT collection isn't verified!")]
    UnverifiedCollection,
    #[msg("Public key mismatch!")]
    PublicKeyMismatch,
    #[msg("Nickname can't be longer than 32 characters!")]
    NicknameTooLong,
    #[msg("You can't feed your Blob more than once a day!")]
    BlobIsFull,
    #[msg("The Blob can't lose a life due to starving unless it hasn't been fed for a week!")]
    BlobNotStarving,
}
