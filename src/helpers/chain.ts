import { Signer } from "ethers";
import { UserNftMinter } from "xpnet-web3-contracts";

/**
 * Internal NFT Info
 * WARN: should be used with care. URI might not be correct
 * and must be manually resolved via cross chain helper
 */
export type NftInfo<Raw> = {
  readonly uri: string;
  readonly native: Raw;
};

/**
 * Transfer Liquidity to a foregin chain, freezing the original liquidity
 *
 * @param sender  Account which owns the liquidity on the native chain, able to sign transactions
 * @param chain_nonce  Nonce of the target chain
 * @param to  Address of the receiver on the foreign chain
 * @param value  Amount of liquidity to send
 *
 * @returns Transaction and the Identifier of this action to track the status
 */
export interface TransferForeign<Signer, ForeignAddr, Balance, Tx, EventIdent> {
  transferNativeToForeign(
    sender: Signer,
    chain_nonce: number,
    to: ForeignAddr,
    value: Balance,
    txFees: Balance
  ): Promise<[Tx, EventIdent]>;
}

/**
 * Unfreeze native liquidity existing on a foreign chain(Send back Liquidity)
 *
 * @param sender  Account which owns the wrapped liquidity on this chain, able to sign transactions
 * @param chain_nonce  Nonce of the original chain
 * @param to  Address of the receiver on the original chain
 * @param value  Amount of liquidity to unfreeze
 *
 * @returns Transaction and the Identifier of this action to track the status
 */
export interface UnfreezeForeign<Signer, ForeignAddr, Balance, Tx, EventIdent> {
  unfreezeWrapped(
    sender: Signer,
    chain_nonce: number,
    to: ForeignAddr,
    value: Balance,
    txFees: Balance
  ): Promise<[Tx, EventIdent]>;
}

/**
 * Transfer NFT to a foreign chain, freezing the original one
 *
 * @param sender  Account which owns the NFT on the native chain, able to sign transactions
 * @param chain_nonce  Nonce of the target chain
 * @param to  Address of the receiver on the foreign chain
 * @param id  Information required to freeze this nft
 *
 * @returns Transaction and the Identifier of this action to track the status
 */
export interface TransferNftForeign<
  Signer,
  ForeignAddr,
  Balance,
  RawNft,
  Tx,
  EventIdent
> {
  transferNftToForeign(
    sender: Signer,
    chain_nonce: number,
    to: ForeignAddr,
    id: NftInfo<RawNft>,
    txFees: Balance
  ): Promise<[Tx, EventIdent]>;
}

/**
 * Unfreeze native NFT existing on a foreign chain(Send back NFT)
 * chain_nonce is automatically derived
 *
 * @param sender  Account which owns the wrapped NFT on this chain, able to sign transactions
 * @param to  Address of the receiver on the original chain
 * @param id  Information required to unfreeze this nft
 *
 * @returns Transaction and the Identifier of this action to track the status
 */
export interface UnfreezeForeignNft<
  Signer,
  ForeignAddr,
  Balance,
  RawNft,
  Tx,
  EventIdent
> {
  unfreezeWrappedNft(
    sender: Signer,
    to: ForeignAddr,
    id: NftInfo<RawNft>,
    txFees: Balance
  ): Promise<[Tx, EventIdent]>;
}

/**
 * Get the balance of an address on the chain
 */
export interface BalanceCheck<Addr, Balance> {
  balance(address: Addr): Promise<Balance>;
}

/**
 * Get the balance of a foreign token for an account in this chain
 *
 * @param address  Address of the user
 * @param chain_nonce  nonce of the foreign chain
 */
export interface WrappedBalanceCheck<Addr, Balance> {
  balanceWrapped(address: Addr, chain_nonce: number): Promise<Balance>;
}

/**
 * Get the balance of multiple foreign tokens for an account in this chain
 *
 * @param chain_nonces  list of foreign tokens to fetch
 * @returns Mapping of chain_nonce to balance
 */
export interface BatchWrappedBalanceCheck<Addr, Balance> {
  balanceWrappedBatch(
    address: Addr,
    chain_nonces: number[]
  ): Promise<Map<number, Balance>>;
}

/**
 * Create a new NFT on this chain
 *
 * @param options Arguments required to mint the nft
 */
export interface MintNft<Signer, Args, Identifier> {
  mintNft(owner: Signer, options: Args): Promise<Identifier>;
}

export type WrappedNft = {
  chain_nonce: number;
  data: Uint8Array;
};
/**
 * Whether the given NFT is from a foreign chain
 * @param {NftIdent} nft NFT Identity
 * @returns bool
 */
export interface WrappedNftCheck<RawNft> {
  isWrappedNft(nft: NftInfo<RawNft>): boolean;
}

export interface PackNft<Raw> {
  wrapNftForTransfer(nft: NftInfo<Raw>): Uint8Array;
}

export interface DecodeWrappedNft<Data> {
  decodeWrappedNft(raw_data: NftInfo<Data>): WrappedNft;
}

// @internal
export interface DecodeRawNft<NativeRaw> {
  /**
   * convert raw nft to native one
   * uri should be unset!
   */
  decodeNftFromRaw(data: Uint8Array): Promise<NftInfo<NativeRaw>>;
}

export type BareNft = {
  chainId: string;
  uri: string;
};

// @internal
export interface PopulateDecodedNft<NativeRaw> {
  /**
   * Get uri for an nft from "decodeNftFromRaw"
   */
  populateNft(nft: NftInfo<NativeRaw>): Promise<BareNft>;
}

export interface EstimateTxFees<RawNft, Balance> {
  estimateValidateTransferNft(to: string, nft: Uint8Array): Promise<Balance>;
  estimateValidateUnfreezeNft(
    to: string,
    nft: NftInfo<RawNft>
  ): Promise<Balance>;
}

export function ConcurrentSendError(): Error {
  return new Error("concurrent_send");
}

export interface ChainNonceGet {
  getNonce(): number;
}
