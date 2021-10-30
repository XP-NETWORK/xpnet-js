import { ElrondHelper, ElrondParams } from "../helpers/elrond";
import { TronHelper, TronParams } from "../helpers/tron";
import { Web3Helper, Web3Params } from "../helpers/web3";
import { ChainNonce } from "../consts";
import { BareNft, ChainNonceGet, DecodeRawNft, DecodeWrappedNft, EstimateTxFees, MintNft, NftInfo, PackNft, PopulateDecodedNft, TransferNftForeign, UnfreezeForeignNft, WrappedNftCheck } from "..";
import BigNumber from "bignumber.js";
export declare type CrossChainHelper = ElrondHelper | Web3Helper | TronHelper;
declare type NftUriChain<RawNft> = ChainNonceGet & WrappedNftCheck<RawNft> & DecodeWrappedNft<RawNft> & DecodeRawNft<RawNft> & PopulateDecodedNft<RawNft>;
declare type FullChain<Signer, RawNft, Tx> = TransferNftForeign<Signer, string, BigNumber, RawNft, Tx, string> & UnfreezeForeignNft<Signer, string, BigNumber, RawNft, Tx, string> & EstimateTxFees<RawNft, BigNumber> & PackNft<RawNft> & NftUriChain<RawNft>;
/**
 * A type representing a chain factory.
 *
 */
declare type ChainFactory = {
    /**
     * Creates an helper factory for a given chain
     * @type T: Either {@link ElrondHelper} | {@link Web3Helper} | {@link TronHelper} as required.
     * @type P: Either {@link ElrondParams} | {@link Web3Params} | {@link TronParams} as required.
     * @param chain: {@link Chain} to create the helper for.
     */
    inner<T, P>(chain: ChainNonce<T, P>): Promise<T>;
    /**
     * Transfers the NFT from one chain to other.
     * @param fromChain {@link FullChain} the chain to transfer from. Use inner method of the factory to get this.
     * @param toChain {@link FullChain} the chain to transfer to. Use inner method of the factory to get this.
     * @param nft {@link NftInfo} the nft to be transferred. Can be fetched from the nftList method of the factory.
     * @param sender {@link Sender} The owner of the NFT.
     * @param receiver Address of the Receiver of the NFT.
     */
    transferNft<SignerF, RawNftF, TxF, SignerT, RawNftT, TxT>(fromChain: FullChain<SignerF, RawNftF, TxF>, toChain: FullChain<SignerT, RawNftT, TxT>, nft: NftInfo<RawNftF>, sender: SignerF, receiver: string): Promise<[TxF, string]>;
    /**
     * Mints an NFT on the chain.
     * @param chain: {@link MintNft} Chain to mint the nft on. Can be obtained from the `inner` method on the factory.
     * @param owner: {@link Signer} A signer to sign transaction, can come from either metamask, tronlink, or the elrond's maiar wallet.
     * @param args: {@link NftMintArgs} Arguments to mint the nft. Contract is must for web3 and tron. Identifier is must for elrond.
     */
    mint<Signer, R>(chain: MintNft<Signer, NftMintArgs, R>, owner: Signer, args: NftMintArgs): Promise<R>;
    /**
     * Lists all the NFTs on the chain owner by {@param owner}.
     * @param chain: {@link NftUriChain<RawNft>} Chain on which the NFT was minted. Can be obtained from the `inner` method on the factory.
     * @param owner: Address of the owner of the NFT.
     */
    nftList<RawNft>(chain: NftUriChain<RawNft>, owner: string): Promise<NftInfo<RawNft>[]>;
    /**
     * Fetches the URI of the NFTs on the chain.
     * @param chain: {@link NftUriChain<RawNft>} Chain on which the NFT was minted. Can be obtained from the `inner` method on the factory.
     * @param nft: {@link NftInfo<RawNft>} The NFT of which you want to fetch the URI. Usually comes from the `nftList` method.
     */
    nftUri<RawNft>(chain: NftUriChain<RawNft>, nft: NftInfo<RawNft>): Promise<BareNft>;
    estimateFees<SignerF, RawNftF, TxF, SignerT, RawNftT, TxT>(fromChain: FullChain<SignerF, RawNftF, TxF>, toChain: FullChain<SignerT, RawNftT, TxT>, nft: NftInfo<RawNftF>, receiver: string): Promise<BigNumber>;
    updateParams<T, TP>(nonce: ChainNonce<T, TP>, params: TP): void;
};
/**
 * A type representing all the supported chain params.
 */
export interface ChainParams {
    elrondParams: ElrondParams;
    hecoParams: Web3Params;
    bscParams: Web3Params;
    ropstenParams: Web3Params;
    avalancheParams: Web3Params;
    polygonParams: Web3Params;
    fantomParams: Web3Params;
    tronParams: TronParams;
    celoParams: Web3Params;
    harmonyParams: Web3Params;
    ontologyParams: Web3Params;
}
/**
 * This function is the basic entry point to use this package as a library.
 * @param chainParams: {@link ChainParams} Contains the details for all the chains to mint and transfer NFTs between them.
 * @returns {ChainFactory}: A factory object that can be used to mint and transfer NFTs between chains.
 */
export declare function ChainFactory(chainParams: Partial<ChainParams>): ChainFactory;
/**
 * The interface that defines the arguments to mint an NFT.
 * @property contract is the address of the smart contract that will mint the NFT and it is mandatory for WEB3 and Tron Chains.
 * @property identifier is the identifier of the NFT to mint and it is mandatory for Elrond Chain.
 */
export interface NftMintArgs {
    readonly contract?: string;
    readonly uris: string[];
    readonly identifier?: string;
    readonly quantity?: number | undefined;
    readonly name?: string;
    readonly royalties?: number | undefined;
    readonly hash?: string | undefined;
    readonly attrs: string | undefined;
}
export {};