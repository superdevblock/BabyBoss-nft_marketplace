import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchStakingData } from "./fetchStakingData"

export interface StakingItemData {
    id: number
    owner: string
    startTime: number
    stakedDays: number
}

interface StakingDataResponse {
    stakingNFTs: StakingItemData[]
    count: number
}

export interface StakingData {
    stakingNFTs: StakingItemData[]
    count: number
    status: 'idle' | 'loading' | 'fulfilled' | 'failed'
}

const initialState: StakingData = {
    stakingNFTs: [],
    count: 0,
    status: 'idle',
}

export const fetchStakingDataSync = createAsyncThunk<StakingDataResponse>(
    'staking/fetchStakingData',
    async () => {
      const nftsOnStaking = await fetchStakingData()
      let _count = 0
      if(nftsOnStaking) {
        _count = nftsOnStaking.length
      }
      return {
        stakingNFTs: nftsOnStaking,
        count: _count,
      }
    }
)


export const stakingSlice = createSlice({
    name: "staking",
    initialState,
    reducers: {
        updateStakingItem: (state, action) => {
          state.stakingNFTs[action.payload.id].owner = action.payload.owner
          state.stakingNFTs[action.payload.id].startTime = action.payload.startTime
          state.stakingNFTs[action.payload.id].stakedDays = action.payload.stakedDays
        },
        updateStakingCount: (state, action) => {
          state.count = action.payload.count;
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchStakingDataSync.pending, (state) => {
            state.status = 'loading'
          })
          .addCase(fetchStakingDataSync.fulfilled, (state, action) => {
            state.stakingNFTs = action.payload.stakingNFTs
            state.count = action.payload.count
            state.status = 'fulfilled'
          })
          .addCase(fetchStakingDataSync.rejected, (state) => {
            state.status = 'failed'
          })
      },
})


export const { updateStakingCount, updateStakingItem } = stakingSlice.actions

export default stakingSlice.reducer
