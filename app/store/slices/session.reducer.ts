import { SessionModel } from '@/app/components/nav-main'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SessionState {
  items: SessionModel[]
  loading: boolean
  error: string | null
}

const initialState: SessionState = {
  items: [],
  loading: false,
  error: null,
}

export const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setSessions: (state, action: PayloadAction<SessionModel[]>) => {
      state.items = action.payload
      state.loading = false
      state.error = null
    },
    addSession: (state, action: PayloadAction<SessionModel>) => {
      state.items.push(action.payload)
    },
    updateSession: (state, action: PayloadAction<SessionModel>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteSession: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setSessions, addSession, updateSession, deleteSession, setLoading, setError } =
  sessionSlice.actions

export default sessionSlice.reducer
