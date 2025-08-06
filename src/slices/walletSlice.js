import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  addWallet,
  getUserWallets,
  deleteWallet,
  setPrimaryWallet,
} from "../services/operations/walletApi"
import toast from "react-hot-toast"
export const fetchWallets = createAsyncThunk(
  "wallet/fetchWallets",
  async (token, { rejectWithValue }) => {
    try {
      const res = await getUserWallets(token)
      return res
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed")
    }
  }
)

export const linkWallet = createAsyncThunk(
  "wallet/linkWallet",
  async ({ walletData, token }, { dispatch, rejectWithValue }) => {
    try {
      const res = await addWallet({ ...walletData, token })
      await dispatch(fetchWallets(token))
      return res
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Linking failed")
    }
  }
)

export const removeWallet = createAsyncThunk(
  "wallet/removeWallet",
  async ({ address, token }, { dispatch, rejectWithValue }) => {
    try {
      const res = await deleteWallet(address, token)
      await dispatch(fetchWallets(token))
      return res
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed")
    }
  }
)

export const makePrimary = createAsyncThunk(
  "wallet/makePrimary",
  async ({ address, token }, { dispatch, rejectWithValue }) => {
    try {
      const res = await setPrimaryWallet(address, token)
      await dispatch(fetchWallets(token))
      return res
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Primary update failed")
    }
  }
)

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    primaryWallet: null,
    wallets: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallets.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWallets.fulfilled, (state, action) => {
        state.primaryWallet = action.payload.primaryWallet
        state.wallets = action.payload.wallets
        state.loading = false
      })
      .addCase(linkWallet.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        if (action.payload) {
          toast.error(action.payload)
        } else {
          toast.error("Failed to link wallet.")
        }
      })

  },
})

export default walletSlice.reducer
