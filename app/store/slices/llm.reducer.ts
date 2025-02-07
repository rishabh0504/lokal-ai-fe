import { LLMModel } from '@/app/(routes)/llm/types/type'
import { API_CONFIG } from '@/app/utils/config'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface LLMState {
  items: LLMModel[]
  loading: boolean
  error: string | null
}

const initialState: LLMState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchLLMs = createAsyncThunk('llms/fetchLLMs', async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.llms.get}`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch LLMs')
  }
  const data: LLMModel[] = await response.json()
  return data
})

export const llmSlice = createSlice({
  name: 'llms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLLMs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLLMs.fulfilled, (state, action: PayloadAction<LLMModel[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchLLMs.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch LLMs'
      })
  },
})

export default llmSlice.reducer
