import { gql } from '@apollo/client';

export interface Nft {
	id: string;
	tokenId: string;
	owner: string;
	approved: string;
	stake: boolean;
}

export interface GetNftsData {
  nfts: Nft[];
}  
 
export const GET_NFTS = gql`
	query GetNfts {
		nfts(first: 10) {
			id
			tokenId
			owner
			approved
			stake
		}
	}
`