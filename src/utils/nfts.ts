import { INDEXER_SERVICE_URL } from "../consts/near";
import { InvokeResult } from "@polywrap/core-js";
import { fetchWithViewFunction } from "./polywrap";

const NFT_METADATA_METHOD_NAME = "nft_metadata";
const NFT_TOKENS_FOR_ACCOUNT_FROM_COLLECTION_METHOD_NAME =
  "nft_tokens_for_owner";

interface AccountLikelyNftContractsList {
  lastBlockTimestamp: string;
  // Contains contract names of NFTs
  list: string[];
}

export async function listLikelyNftsContracts(
  accountId: string
): Promise<AccountLikelyNftContractsList> {
  return fetch(
    `${INDEXER_SERVICE_URL}/account/${accountId}/likelyNFTsFromBlock`
  ).then((res) => res.json());
}

interface NftCollectionMetadata {
  name: string;
  icon: string;
}

export async function fetchNftCollectionMetadata(
  nftContractName: string,
  viewFunctionExecute: (
    args?: Record<string, unknown> | Uint8Array
  ) => Promise<InvokeResult>
): Promise<NftCollectionMetadata | null> {
  return fetchWithViewFunction(
    {
      contractId: nftContractName,
      methodName: NFT_METADATA_METHOD_NAME,
      args: JSON.stringify(""),
    },
    viewFunctionExecute
  );
}

interface NftMetadata {
  owner_id: string;
  token_id: string;
  metadata: {
    title: string;
    description: string;
    media: string;
  };
}

export async function fetchNftsFromCollectionForAccount(
  nftCollectionContractName: string,
  accountId: string,
  viewFunctionExecute: (
    args?: Record<string, unknown> | Uint8Array
  ) => Promise<InvokeResult>
): Promise<NftMetadata[] | null> {
  return fetchWithViewFunction(
    {
      contractId: nftCollectionContractName,
      methodName: NFT_TOKENS_FOR_ACCOUNT_FROM_COLLECTION_METHOD_NAME,
      args: JSON.stringify({ account_id: accountId }),
    },
    viewFunctionExecute
  );
}