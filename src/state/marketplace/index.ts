import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchNFTData } from "./fetchMarkeplaceNFTData"

export interface NFTData {
    id: number
    name: string
    price: number
    totalVolume: number
}

interface NFTDataResponse {
    nfts: NFTData[]
    items: number
    owners: number
    floorPrice: number
    marketPrice: number
    totalVolume: number
}

export interface MarketplaceData {
    nfts: NFTData[]
    items: number
    owners: number
    floorPrice: number
    marketPrice: number
    totalVolume: number
    status: 'idle' | 'loading' | 'fulfilled' | 'failed'
}

const initialState: MarketplaceData = {
    nfts: [],
    items: 2600,
    owners: 0,
    floorPrice: 0,
    marketPrice: 0,
    totalVolume: 0,
    status: 'idle',
}

export const fetchNFTDataAsync = createAsyncThunk<NFTDataResponse>(
  'marketplace/fetchNFTData',
  async () => {
    const nfts = await fetchNFTData()
    let _floorPrice = 100000000;
    for(let i = 0; i < nfts.length; i++) {
      if(nfts[i].price == 0) continue 
      _floorPrice = _floorPrice < nfts[i].price ? _floorPrice : nfts[i].price
    }
    let _totalVolume = 0;
    if(nfts) {
      nfts.map((item: NFTData) => {
        _totalVolume += Number(item.totalVolume)
      })
    }
    return {
      nfts,
      items: 2600,
      owners: 10,
      floorPrice: _floorPrice,
      marketPrice: 0,
      totalVolume: _totalVolume,
    }
  }
)

export const marketplaceSlice = createSlice({
    name: "marketplace",
    initialState,
    reducers: {
        updateMarketplaceFloorPrice: (state, action) => {
            state.floorPrice = action.payload.floorPrice;
        },
        updateMarketplaceMarketPrice: (state, action) => {
            state.marketPrice = action.payload.marketPrice;
        },
        updateMarketplaceTotalVolume: (state, action) => {
            state.totalVolume = action.payload.totalVolume;
        },
        updateMarketplaceNFTDataWithEmpty: (state, action) => {
            state.nfts = []
        },
        updateMarketplaceItemPrice: (state, action) => {
            const id = action.payload.id
            state.nfts[id].price = action.payload.price
            state.nfts[id].totalVolume += action.payload.tradingVolume
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchNFTDataAsync.pending, (state) => {
            state.status = 'loading'
          })
          .addCase(fetchNFTDataAsync.fulfilled, (state, action) => {
            state.nfts = action.payload.nfts
            state.items = action.payload.items
            state.owners = action.payload.owners
            state.floorPrice = action.payload.floorPrice
            state.marketPrice = action.payload.marketPrice
            state.totalVolume = action.payload.totalVolume
            state.status = 'fulfilled'
          })
          .addCase(fetchNFTDataAsync.rejected, (state) => {
            state.status = 'failed'
          })
      },
})


export const { updateMarketplaceFloorPrice, updateMarketplaceMarketPrice, updateMarketplaceTotalVolume, updateMarketplaceNFTDataWithEmpty, updateMarketplaceItemPrice } = marketplaceSlice.actions

export default marketplaceSlice.reducer
