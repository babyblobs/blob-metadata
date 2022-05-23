// @ts-check
'use strict';
const path = require('path');
const metadataProvider = require('./packages/sdk/dist/generated/accounts');
const candyProvider = require('../../metaplex-studios/metaplex-foundation/metaplex-program-library/candy-machine/js/dist/src/generated/accounts');

const accountProviders = { ...metadataProvider, ...candyProvider };

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
];

const accounts = [
    {
        label: 'Token Metadata Program',
        accountId: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
        // marking executable as true will cause Amman to pull the executable data account as well automatically
        executable: true,
    },
    {
        label: 'Candy Machine',
        accountId: 'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ',
        executable: true,
    },
    {
        label: 'Wallet',
        accountId: '8CUKodqiQeAP3MjJWgUWQkKrX2hfQe2323wHCMMdeJeC',
    },
    {
        label: 'Candy IDL',
        accountId: 'CggtNXgCye2qk7fLohonNftqaKT35GkuZJwHrRghEvSF',
    },
    // {
    //     label: 'Nft Edition',
    //     accountId: 'DLYNxgk6HR6ky88zh1yjq2xtv5hsyew5UbPUGydf3nF7',
    // },
    // {
    //     label: 'Nft Metadata',
    //     accountId: '3qLG2bXFZB6vtyBZVgBgoutxnNZzn9GTQzt2kisVFuuX',
    // },
    // {
    //     label: 'Collection Mint',
    //     accountId: '9e1y176RFrF9mfVg8izQs2cjrkfAcdzJ32E6WNkkuXtZ',
    // },
    // {
    //     label: 'Nft Mint',
    //     accountId: '3ajvQXu1A3gdUau9ZZqJ2y3jjqKWU6jrGpd3QENeLkeb',
    // },
    // {
    //     label: 'Nft Edition',
    //     accountId: 'DLYNxgk6HR6ky88zh1yjq2xtv5hsyew5UbPUGydf3nF7',
    // },
    // {
    //     label: 'Nft Metadata',
    //     accountId: '3qLG2bXFZB6vtyBZVgBgoutxnNZzn9GTQzt2kisVFuuX',
    // },
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
