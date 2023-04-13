import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { act } from 'react-dom/test-utils'

export interface NetworkDownline {
  firstLevel: number
  secondLevel: number
  thirdLevel: number
  forthLevel: number
  totalReferrals: number
}

export interface NFTPurchased {
  firstLevel: number
  secondLevel: number
  thirdLevel: number
  forthLevel: number
  totalNFTPurchased: number
}

export interface BNBEarned {
  firstLevel: number
  secondLevel: number
  thirdLevel: number
  forthLevel: number
  totalBNBEarned: number
}

export interface GenealogicalTree {
  publicKey: string
  level: number
}

export interface ReferralData {
  networkDownline: NetworkDownline
  genealogicalTree: GenealogicalTree[]
  nftPurchased: NFTPurchased
  bnbEarned: BNBEarned
}

const initialState: ReferralData = {
  networkDownline: {firstLevel: 0, secondLevel: 0, thirdLevel: 0, forthLevel: 0, totalReferrals: 0},
  genealogicalTree: [],
  nftPurchased: {firstLevel: 0, secondLevel: 0, thirdLevel: 0, forthLevel: 0, totalNFTPurchased: 0},
  bnbEarned: {firstLevel: 0, secondLevel: 0, thirdLevel: 0, forthLevel: 0, totalBNBEarned: 0},
}

export const referralSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateNetworkDownline: (state, action) => {
      state.networkDownline.firstLevel = action.payload.networkDownline[0]
      state.networkDownline.secondLevel = action.payload.networkDownline[1]
      state.networkDownline.thirdLevel = action.payload.networkDownline[2]
      state.networkDownline.forthLevel = action.payload.networkDownline[3]
    },
    updateNFTPurchased: (state, action) => {
      state.nftPurchased.firstLevel = Number(action.payload[0])
      state.nftPurchased.secondLevel = Number(action.payload[1])
      state.nftPurchased.thirdLevel = Number(action.payload[2])
      state.nftPurchased.forthLevel = Number(action.payload[3])
      state.nftPurchased.totalNFTPurchased = Number(action.payload[0])+Number(action.payload[1])+Number(action.payload[2])+Number(action.payload[3])
    },
    updateBNBEarned: (state, action) => {
      state.bnbEarned.firstLevel = Number(action.payload[0])
      state.bnbEarned.secondLevel = Number(action.payload[1])
      state.bnbEarned.thirdLevel = Number(action.payload[2])
      state.bnbEarned.forthLevel = Number(action.payload[3])
      state.bnbEarned.totalBNBEarned = Number(action.payload[0])+Number(action.payload[1])+Number(action.payload[2])+Number(action.payload[3])
    },
    updateGenealogicalTree: (state, action) => {
      state.genealogicalTree = action.payload.genealogicalTree
    }
  }, 
})

export const { updateNFTPurchased, updateNetworkDownline, updateGenealogicalTree, updateBNBEarned } = referralSlice.actions

export default referralSlice.reducer
