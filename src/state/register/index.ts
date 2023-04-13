import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchIsRegistered } from './fetchRegisterUser'

export interface RegisterData {
  isRegister: boolean
  sponsor: string
  status: 'idle' | 'loading' | 'fulfilled' | 'failed'
}

interface RegisterDataResponse {
  isRegister: boolean
}

const initialState: RegisterData = {
  isRegister: false,
  sponsor: '',
  status: 'idle',
}


export const fetchIsRegisteredAsync = createAsyncThunk<RegisterDataResponse, {account: any}>(
  'register/fetchIsRegistered',
  async ({account}) => {
    const isRegistered = await fetchIsRegistered(account)
    return {isRegister : isRegistered}
  }
)


export const registerSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateRegister: (state, action) => {
      console.log("sniper: updateRegister: ", action.payload.isRegister)
      state.isRegister = action.payload.isRegister
    },
    updateSponsor: (state, action) => {
      state.sponsor = action.payload.sponsor
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIsRegisteredAsync.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchIsRegisteredAsync.fulfilled, (state, action) => {
        state.isRegister = action.payload.isRegister
        state.status = 'fulfilled'
      })
      .addCase(fetchIsRegisteredAsync.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export const { updateRegister, updateSponsor } = registerSlice.actions

export default registerSlice.reducer
