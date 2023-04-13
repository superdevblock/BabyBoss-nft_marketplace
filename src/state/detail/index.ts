import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { AUTHOR, MINT_TRANSACTION } from "config/nfts"
import { stat } from "fs"
import { RootState } from "state"
import { getNFTAddress } from "utils/addressHelpers"
import { fetchNFTDetailData } from "./fetchNFTDetailData"

export interface NFTData {
    id: number
    name: string
    minter: string
    collection: string
    totalToken: number
    stakingDays: number
    mintedTokens: number
    claimableTokens: number
    mintTransaction: string
    contractAddress: string
    isStake: boolean
    stakingTime: number
    status: 'idle' | 'loading' | 'failed' | 'fulfilled'
}

interface NFTDataResponse {
    id: number
    name: string
    minter: string
    collection: string
    totalToken: number
    stakingDays: number
    mintedTokens: number
    claimableTokens: number
    mintTransaction: string
    contractAddress: string
    isStake: boolean
    stakingTime: number
}

const initialState: NFTData = {
    id: 0,
    name: "#1 NFT 1 of 100",
    minter: AUTHOR,
    collection: "",
    totalToken: 0,
    stakingDays: 0,
    mintedTokens: 0,
    claimableTokens: 0,
    mintTransaction: MINT_TRANSACTION,
    contractAddress: getNFTAddress(),
    isStake: false,
    stakingTime: 0,
    status: 'idle'
}


export const fetchNFTDetailDataSync = createAsyncThunk<NFTDataResponse, {id: number}, {state: RootState}>(
    'detail/fetchNFTDetailData',
    async ({id}) => {
      const detail = await fetchNFTDetailData(id)
      return detail
    }
)
  
export const detailSlice = createSlice({
    name: "detail",
    initialState,
    reducers: {
        // updateNFTDetailData: (state, action) => {
        //     state.floorPrice = action.payload.floorPrice;
        // },
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchNFTDetailDataSync.pending, (state) => {
            state.status = 'loading'
          })
          .addCase(fetchNFTDetailDataSync.fulfilled, (state, action) => {
            state.id = action.payload.id
            state.name = action.payload.name
            state.minter = action.payload.minter
            state.collection = action.payload.collection
            state.totalToken = action.payload.totalToken
            state.stakingDays = action.payload.stakingDays
            state.mintedTokens = action.payload.mintedTokens
            state.claimableTokens = action.payload.claimableTokens
            state.mintTransaction = action.payload.mintTransaction
            state.contractAddress = action.payload.contractAddress
            state.isStake = action.payload.isStake
            state.stakingTime = action.payload.stakingTime
            state.status = 'fulfilled'
          })
          .addCase(fetchNFTDetailDataSync.rejected, (state) => {
            state.status = 'failed'
          })
      },
})


export const { } = detailSlice.actions

export default detailSlice.reducer
