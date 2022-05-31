import { program } from 'commander';
import log from 'loglevel';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import {
  findExtensionManager,
  findExtensionMetadata,
  findMetadataPda,
  loadWalletKey,
} from './utils';
import {
  createFeedInstruction,
  createInitializeExtensionManagerInstruction,
  createInitializeExtensionMetadataInstruction,
  createLoseLifeInstruction,
  createUpdateAsAuthorityInstruction,
  createUpdateNicknameInstruction,
  ExtensionMetadata,
  FeedInstructionAccounts,
  InitializeExtensionManagerInstructionAccounts,
  InitializeExtensionMetadataInstructionAccounts,
  InitializeExtensionMetadataInstructionArgs,
  LoseLifeInstructionAccounts,
  RemainingDataTypes,
  UpdateAsAuthorityInstructionAccounts,
  UpdateAsAuthorityInstructionArgs,
  UpdateNicknameInstructionAccounts,
  UpdateNicknameInstructionArgs,
} from 'blob-metadata';
import { BN } from '@project-serum/anchor';

const RPC = 'http://127.0.0.1:8899';
const solConnection = new Connection(RPC, 'confirmed');
const DEFAULT_COLLECTION = '94DVUnq5TgZtY3K9atnxxfdHBQjCtCAdjzWUNtZWZERm';

program.version('0.1.0');
log.setLevel('info');

programCommand('create_manager')
  .option('-c, --collection <string>', 'collection_mint', DEFAULT_COLLECTION)
  .action(async (cmd) => {
    const { keypair, collection } = cmd;
    const collectionMint = new PublicKey(collection);
    const walletKeyPair = loadWalletKey(keypair);
    const extensionManager = findExtensionManager(collectionMint)[0];
    const metadata = findMetadataPda(collectionMint)[0];
    const accounts: InitializeExtensionManagerInstructionAccounts = {
      extensionManager,
      metadata,
      mint: collectionMint,
      updateAuthority: walletKeyPair.publicKey,
    };

    const transaction = new Transaction().add(
      createInitializeExtensionManagerInstruction(accounts),
    );
    const signature = await solConnection.sendTransaction(transaction, [walletKeyPair], {
      skipPreflight: true,
    });
    console.log(signature);
  });

programCommand('create_metadata')
  .option('-c, --collection <string>', 'collection_mint', DEFAULT_COLLECTION)
  .requiredOption('-m, --mint <string>', 'mint')
  .option('-n, --nickname <string>', 'nickname', 'defaultNickname')
  .action(async (cmd) => {
    const { keypair, collection, mint, nickname } = cmd;
    const collectionMint = new PublicKey(collection);
    const nftMint = new PublicKey(mint);
    const walletKeyPair = loadWalletKey(keypair);
    const extensionManager = findExtensionManager(collectionMint)[0];
    const extensionMetadata = findExtensionMetadata(collectionMint, nftMint)[0];
    const metadata = findMetadataPda(nftMint)[0];
    const { value: tokens } = await solConnection.getTokenLargestAccounts(nftMint);
    const token = tokens[0].address;
    const accounts: InitializeExtensionMetadataInstructionAccounts = {
      extensionMetadata,
      payer: walletKeyPair.publicKey,
      extensionManager,
      collectionMint,
      mint: nftMint,
      metadata,
      token,
    };
    const args: InitializeExtensionMetadataInstructionArgs = { nickname };

    const transaction = new Transaction().add(
      createInitializeExtensionMetadataInstruction(accounts, args),
    );
    const signature = await solConnection.sendTransaction(transaction, [walletKeyPair], {
      skipPreflight: true,
    });
    console.log(signature);
  });

programCommand('update_nickname')
  .option('-c, --collection <string>', 'collection_mint', DEFAULT_COLLECTION)
  .requiredOption('-m, --mint <string>', 'mint')
  .requiredOption('-n, --nickname <string>', 'nickname')
  .action(async (cmd) => {
    const { keypair, collection, mint, nickname } = cmd;
    const collectionMint = new PublicKey(collection);
    const nftMint = new PublicKey(mint);
    const walletKeyPair = loadWalletKey(keypair);
    const extensionManager = findExtensionManager(collectionMint)[0];
    const extensionMetadata = findExtensionMetadata(collectionMint, nftMint)[0];
    const metadata = findMetadataPda(nftMint)[0];
    const { value: tokens } = await solConnection.getTokenLargestAccounts(nftMint);
    const token = tokens[0].address;
    const accounts: UpdateNicknameInstructionAccounts = {
      extensionMetadata,
      payer: walletKeyPair.publicKey,
      extensionManager,
      collectionMint,
      mint: nftMint,
      metadata,
      token,
    };

    const args: UpdateNicknameInstructionArgs = {
      nickname,
    };

    const transaction = new Transaction().add(createUpdateNicknameInstruction(accounts, args));
    const signature = await solConnection.sendTransaction(transaction, [walletKeyPair], {
      skipPreflight: true,
    });
    console.log(signature);
  });

programCommand('update_as_authority')
  .requiredOption('-m, --mint <string>', 'mint')
  .option('-c, --collection <string>', 'collection_mint', DEFAULT_COLLECTION)
  .option('-n, --nickname <string>', 'nickname')
  .option('-l, --lives <string>', 'lives')
  .option('-lf, --lastFed <string>', 'last fed')
  .option('-fs, --feedStreak <string>', 'feed streak')
  .action(async (cmd) => {
    const { keypair, collection, mint, nickname, lives, lastFed, feedStreak } = cmd;
    const collectionMint = new PublicKey(collection);
    const nftMint = new PublicKey(mint);
    const walletKeyPair = loadWalletKey(keypair);
    const extensionManager = findExtensionManager(collectionMint)[0];
    const extensionMetadata = findExtensionMetadata(collectionMint, nftMint)[0];
    const metadata = findMetadataPda(nftMint)[0];
    const accounts: UpdateAsAuthorityInstructionAccounts = {
      extensionMetadata,
      updateAuthority: walletKeyPair.publicKey,
      extensionManager,
      collectionMint,
      metadata,
    };

    const { extensionData } = await ExtensionMetadata.fromAccountAddress(
      solConnection,
      extensionMetadata,
    );

    const lastFedData = lastFed === undefined ? extensionData.lastFed : new BN(lastFed);
    const livesData = lives === undefined ? extensionData.lives : parseInt(lives);
    const feedStreakData = feedStreak === undefined ? extensionData.feedStreak : feedStreak;

    const args: UpdateAsAuthorityInstructionArgs = {
      data: {
        nickname: nickname ?? null,
        lives: livesData,
        lastFed: lastFedData,
        feedStreak: feedStreakData,
        otherInfo: RemainingDataTypes.None,
      },
    };

    const transaction = new Transaction().add(createUpdateAsAuthorityInstruction(accounts, args));
    const signature = await solConnection.sendTransaction(transaction, [walletKeyPair], {
      skipPreflight: true,
    });
    console.log(signature);
  });

programCommand('reset_last_fed')
  .requiredOption('-m, --mint <string>', 'mint')
  .option('-c, --collection <string>', 'collection_mint', DEFAULT_COLLECTION)
  .action(async (cmd) => {
    const { keypair, collection, mint } = cmd;
    const collectionMint = new PublicKey(collection);
    const nftMint = new PublicKey(mint);
    const walletKeyPair = loadWalletKey(keypair);
    const extensionManager = findExtensionManager(collectionMint)[0];
    const extensionMetadata = findExtensionMetadata(collectionMint, nftMint)[0];
    const metadata = findMetadataPda(nftMint)[0];
    const accounts: UpdateAsAuthorityInstructionAccounts = {
      extensionMetadata,
      updateAuthority: walletKeyPair.publicKey,
      extensionManager,
      collectionMint,
      metadata,
    };

    const { extensionData } = await ExtensionMetadata.fromAccountAddress(
      solConnection,
      extensionMetadata,
    );

    const lastFedData = extensionData.lastFed - 60 * 60 * 24;

    const args: UpdateAsAuthorityInstructionArgs = {
      data: {
        nickname: extensionData.nickname,
        lives: extensionData.lives,
        lastFed: lastFedData,
        feedStreak: extensionData.feedStreak,
        otherInfo: RemainingDataTypes.None,
      },
    };

    const transaction = new Transaction().add(createUpdateAsAuthorityInstruction(accounts, args));
    const signature = await solConnection.sendTransaction(transaction, [walletKeyPair], {
      skipPreflight: true,
    });
    console.log(signature);
  });

programCommand('lose_life')
  .option('-c, --collection <string>', 'collection_mint', DEFAULT_COLLECTION)
  .requiredOption('-m, --mint <string>', 'mint')
  .action(async (cmd) => {
    const { keypair, collection, mint } = cmd;
    const collectionMint = new PublicKey(collection);
    const nftMint = new PublicKey(mint);
    const walletKeyPair = loadWalletKey(keypair);
    const extensionMetadata = findExtensionMetadata(collectionMint, nftMint)[0];
    const accounts: LoseLifeInstructionAccounts = {
      extensionMetadata,
      payer: walletKeyPair.publicKey,
      collectionMint,
      mint: nftMint,
    };

    const transaction = new Transaction().add(createLoseLifeInstruction(accounts));
    const signature = await solConnection.sendTransaction(transaction, [walletKeyPair], {
      skipPreflight: true,
    });
    console.log(signature);
  });

programCommand('feed')
  .option('-c, --collection <string>', 'collection_mint', DEFAULT_COLLECTION)
  .requiredOption('-m, --mint <string>', 'mint')
  .action(async (cmd) => {
    const { keypair, collection, mint } = cmd;
    const collectionMint = new PublicKey(collection);
    const nftMint = new PublicKey(mint);
    const walletKeyPair = loadWalletKey(keypair);
    const extensionManager = findExtensionManager(collectionMint)[0];
    const extensionMetadata = findExtensionMetadata(collectionMint, nftMint)[0];
    const metadata = findMetadataPda(nftMint)[0];
    const { value: tokens } = await solConnection.getTokenLargestAccounts(nftMint);
    const token = tokens[0].address;
    const accounts: FeedInstructionAccounts = {
      extensionMetadata,
      payer: walletKeyPair.publicKey,
      extensionManager,
      collectionMint,
      mint: nftMint,
      metadata,
      token,
    };

    const transaction = new Transaction().add(createFeedInstruction(accounts));
    const signature = await solConnection.sendTransaction(transaction, [walletKeyPair], {
      skipPreflight: true,
    });
    console.log(signature);
  });

function programCommand(name: string) {
  return program
    .command(name)
    .requiredOption('-k, --keypair <path>', `Solana wallet location`)
    .option('-l, --log-level <string>', 'log level', setLogLevel);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setLogLevel(value, prev) {
  if (value === undefined || value === null) {
    return;
  }
  log.info('setting the log value to: ' + value);
  log.setLevel(value);
}

program.parse(process.argv);
