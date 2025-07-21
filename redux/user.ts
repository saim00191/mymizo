import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type UserInfo = {
  uid: string
  email: string
  fullName: string
}

type UserState = {
  userInfo: UserInfo | null
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  userInfo: null,
  isLoading: false,
  error: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload
      state.isLoading = false
      state.error = null
    },
    signOutUser: (state) => {
      state.userInfo = null
      state.isLoading = false
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { setUserInfo, signOutUser, setLoading, setError, clearError } = userSlice.actions
export default userSlice.reducer
