import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { stat } from "fs"
import { RootState } from "state"
import { getNFTAddress } from "utils/addressHelpers"
// import { fetchNFTDetailData } from "./fetchNFTDetailData"

import { fetchNFTStakeData } from "./fetchNFTStakeData"

export interface Nft {
	id: string;
	tokenId: string;
	owner: string;
	approved: string;
	stake: boolean;
}

export interface GetNftsData {
  nfts: Nft[]
	count: number
}  

export interface StakeData {
	nfts: Nft[]
	count: number
	status: 'idle' | 'loading' | 'fulfilled' | 'failed'
} 

const initialState: StakeData = {
	nfts: [],
	count: 0,
	status: 'idle'
}

export const fetchNFTStakeDataSync = createAsyncThunk<GetNftsData>(
	'stakelists/fetchNFTStakeData',
	async () => {
		const nfts = await fetchNFTStakeData();

		let _count = 0
		if(nfts) {
			_count = nfts.length
		}
		return {
			nfts: nfts,
			count: _count,
		}
	}
)
  
export const stakelistsSlice = createSlice({
	name: "stakelists",
	initialState,
	reducers: {
		updateStakeItem: (state, action) => {
			state.nfts[action.payload.token].owner = action.payload.owner;
			state.nfts[action.payload.token].approved = action.payload.approved;
			state.nfts[action.payload.token].stake = action.payload.stake;
		},
		updateStakeCount: (state, action) => {		
			state.count = action.payload.count;
		}
	},
	extraReducers: (builder) => {
			builder
				.addCase(fetchNFTStakeDataSync.pending, (state) => {
					state.status = 'loading'
				})
				.addCase(fetchNFTStakeDataSync.fulfilled, (state, action) => {
					state.nfts = action.payload.nfts
					state.count = action.payload.count
					state.status = 'fulfilled'
				})
				.addCase(fetchNFTStakeDataSync.rejected, (state) => {
					state.status = 'failed'
				})
		},
})

export const {  updateStakeCount, updateStakeItem } = stakelistsSlice.actions

export default stakelistsSlice.reducer
