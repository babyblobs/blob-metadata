// @ts-check
'use strict';
const path = require('path');
const metadataExtensionProvider = require('./packages/sdk/dist/generated/accounts');
const metadataProvider = require('../../metaplex-studios/metaplex-foundation/metaplex-program-library/token-metadata/js/dist/generated/accounts');
const candyProvider = require('../../metaplex-studios/metaplex-foundation/metaplex-program-library/candy-machine/js/dist/src/generated/accounts');

const accountProviders = { ...metadataProvider, ...metadataExtensionProvider, ...candyProvider };

const localDeployDir = path.join(__dirname, 'program', 'target', 'deploy');
const MY_PROGRAM_ID = require('./packages/sdk/idl/blob_metadata.json').metadata.address;

function localDeployPath(programName) {
  return path.join(localDeployDir, `${programName}.so`);
}

const programs = [
  {
    label: 'blob_metadata',
    programId: MY_PROGRAM_ID,
    deployPath: localDeployPath('blob_metadata'),
  },
  {
    label: 'candy_machine',
    programId: 'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ',
    deployPath: path.join(
      __dirname,
      '../../metaplex-studios/metaplex-foundation/metaplex-program-library/candy-machine/program/target/deploy/',
      'mpl_candy_machine.so',
    ),
  },
];

const accounts = [
  {
    label: 'Token Metadata Program',
    accountId: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
    // marking executable as true will cause Amman to pull the executable data account as well automatically
    executable: true,
  },
  {
    label: 'Wallet',
    accountId: '8CUKodqiQeAP3MjJWgUWQkKrX2hfQe2323wHCMMdeJeC',
  },
  {
    label: 'Collection Mint',
    accountId: '94DVUnq5TgZtY3K9atnxxfdHBQjCtCAdjzWUNtZWZERm',
  },
  {
    label: 'Collection Edition',
    accountId: 'AhN1PCbaKygU9YCAXemeqLGdr6azxSsY855txS3S8VXm',
  },
  {
    label: 'Nft Metadata',
    accountId: 'DqL5qSXLRZz5JL77Dr9Y6oYe9yJHfWYZ7NAi6NhrJtQM',
  },
  {
    label: 'Collection Token Account',
    accountId: 'BC8QkZiaN7L6HEkX8nthmWoYCpfnXvWP27gRUgkcNuZ',
  },
];

const validator = {
  programs,
  accounts,
  verifyFees: false,
  limitLedgerSize: 10000000,
};

module.exports = {
  validator,
  relay: {
    accountProviders,
  },
};
