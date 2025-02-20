import { ToolConfig } from '@/app/(routes)/tools/dto/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ToolConfigState {
  items: ToolConfig[]
  loading: boolean
  error: string | null
}

const initialState: ToolConfigState = {
  items: [],
  loading: false,
  error: null,
}

export const toolConfigSlice = createSlice({
  name: 'toolConfig',
  initialState,
  reducers: {
    setToolConfig: (state, action: PayloadAction<ToolConfig[]>) => {
      state.items = action.payload
      state.loading = false
      state.error = null
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setToolConfig, setLoading, setError } = toolConfigSlice.actions

export default toolConfigSlice.reducer
