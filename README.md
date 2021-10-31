# XPNET JavaScript API library

<hr/>

## General description

The JavaScript API is a lightweight library to aid the dApp developers in their seamless integration of the XP.network NFT multi-chain bridge into the NFT centered application. The library abstracts away the inner complexity of the bridge and offers a simple to use interface as a gateway to the bridge functionality.

## 1. Installation

```bash
npm install --save xpnet-js ethers 
```
or
```bash
yarn add xpnet-js ethers 
```

## 2. Importing dependencies
JavaScript:
```javascript
const { ethers, Wallet } = require('ethers');
const { ChainFactory, Chain, CHAIN_INFO, RpcUri } = require('xpnet-js');
```
TypeScript:
```typescript
import { ethers } from 'ethers';
import { ChainFactory, Chain, CHAIN_INFO, RpcUri } from 'xpnet-js';
```

## Setting up local variables:
```javascript
const hecoProvider = new ethers.providers.JsonRpcProvider(RpcUri.HECO);
const bscProvider = new ethers.providers.JsonRpcProvider(RpcUri.BSC);

//@ts-ignore
const factory = ChainFactory({ // Example
  // Replace '0x..' with the smart contract address
  hecoParams: {
    minter_addr: "0x...",
    erc1155_addr: "0x...",
    erc721_addr: "0x...",
    provider: hecoProvider,
    validators: CHAIN_INFO[Chain.HECO].validators,
    nonce:Chain.HECO
  },
  bscParams: {
    erc1155_addr: "0x...",
    erc721_addr: "0x...",
    minter_addr: "0x...",
    validators: CHAIN_INFO[Chain.BSC].validators,
    provider: bscProvider,
    nonce:Chain.BSC
  },
});
```

### Getting a dynamic provider (alternatively)

Example of ChainData object

```javascript
export const ChainData = {
    // Replace 'anotherEvmChain' with the name of your chain
    // Ex.: Ethereum, BSC, Polygon, Avalanche, HECO, etc.
    anotherEvmChain: {
        provider: "anotherEvmChain",    // Replace 'anotherEvmChain'
        middleware_uri: "string",       // Link to the middleware
        erc1155_addr: "string",         // Smart contract address
        minter_addr: "string",          // Smart contract address
        erc721_addr: "string",          // Smart contract address
        validators: "string[]",         // A list of public keys
        nonce: "number",                // Chain nonce, Ex. Chain.Ethereum or 1 or 0x01
    }
 // etc...
}
```
Example of getting a dynamic provider injected from the browser extension
```javascript
export const getProvider = async()=>{
    // Injecting the current provider from a wallet
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Returning its parameters depending on the outcome
    if(from === 'Ethereum') {
        return {
            ethereumParams: {
                ...ChainData.Ethereum,
                provider
                }
        }
    // Replace 'anotherEvmChain' with your chain name
    } else if(from === 'anotherEvmChain') {
        return {
            // Rplace with the name of your chain
            anotherEvmChainParams: {
                // Replace 'anotherEvmChain' with your chain name
                ...ChainData.anotherEvmChain,
                provider
                }
        }
    }
    // etc...
}
```

## 3. Use case Examples:
There are several use cases the xpnet-js library supports.

- [x] Minting NFTs on all the bridged blockchains in a generic way
- [x] Transfering NFTs from chain A to chains B ... Z
- [x] Listing NFTs by a user account
- [x] Fetching an NFT URI from a blockchain

### Minting an NFT
```javascript
(async () => {
  const wallet = new Wallet(
    "0xbaedb25b3352638942e80aa3dbc2d54f2bab423849cce21a73c164f0c21103c8",
    bscProvider
  );
  const inner = await factory.inner(Chain.BSC);

  console.log(
    //@ts-ignore
    await factory.mint(inner, wallet, {
      contract: "0xA3302B7Fd786D8807E687d2Cc846bC7BDd10A7a3",
      uris: ["https://cataas.com/cat"],
    })
  );
})();
```


### Sending an NFT
```javascript
(async () => {
  const result = await factory.transfer(
    toChain,        // 
    froChain,       // 
    nft,            // From the nft-list-db
    sender,         // Public Key
    receiver        // Public Key
  );
})();
```


### Listing NFTs by user account

```javascript
const getRPCFactory = async (chain) => {
    const {from, to} = store.getState().general
    const f = await getFactoryParams(from)
    const t = await getFactoryParams(to)
    console.log(f, t)
    return ChainFactory({ ...f, ...t});
}
```

```javascript
    // Preparatory lines:
    const factory = await getRPCFactory()
    const fromChain = chainsConfig[from]
    const inner = await factory.inner(fromChain.Chain);
    // The mane line:
    const nfts = await factory.nftList(inner, account)
```
