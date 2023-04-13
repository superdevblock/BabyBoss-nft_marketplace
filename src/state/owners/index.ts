import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchOwnerData } from "./fetchOwnerData"

export interface OwnerData {
    id: number
    owner: string
}

interface NFTDataResponse {
    owners: OwnerData[]
    count: number
}

export interface MarketplaceData {
  owners: OwnerData[]
  count: number
  status: 'idle' | 'loading' | 'fulfilled' | 'failed'
}

const initialState: MarketplaceData = {
    owners: [],
    count: 0,
    status: 'idle',
}

export const fetchOwnersAsync = createAsyncThunk<NFTDataResponse>(
    'marketplace/fetchOwners',
    async () => {
      const ownerData = await fetchOwnerData()
      return {
        owners: ownerData.owners,
        count: ownerData.count
      }
    }
)

export const ownerSlice = createSlice({
    name: "marketplace",
    initialState,
    reducers: {
        updateOwner: (state, action) => {
          state.owners[action.payload.id].owner = action.payload.owner;
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchOwnersAsync.pending, (state) => {
            state.status = 'loading'
          })
          .addCase(fetchOwnersAsync.fulfilled, (state, action) => {
            state.owners = action.payload.owners
            state.count = action.payload.count
            state.status = 'fulfilled'
          })
          .addCase(fetchOwnersAsync.rejected, (state) => {
            state.status = 'failed'
          })
      },
})


export const { updateOwner } = ownerSlice.actions

export default ownerSlice.reducer
