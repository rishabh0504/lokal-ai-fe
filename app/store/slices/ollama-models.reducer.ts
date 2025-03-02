import { OllamaModelResponse } from '@/app/(routes)/llm/types/type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface OllamaModelState {
  items: OllamaModelResponse[]
  loading: boolean
  error: string | null
}

const initialState: OllamaModelState = {
  items: [],
  loading: false,
  error: null,
}

export const ollamaModelsSlice = createSlice({
  name: 'ollamaModels',
  initialState,
  reducers: {
    setOllamaModels: (state, action: PayloadAction<OllamaModelResponse[]>) => {
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

export const { setOllamaModels, setLoading, setError } = ollamaModelsSlice.actions

export default ollamaModelsSlice.reducer
