import { LLMModelConfig, OllamaModelResponse } from '@/app/(routes)/llm/types/type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface LLMState {
  items: LLMModelConfig[]
  loading: boolean
  error: string | null
  ollamaModels: OllamaModelResponse[]
}

const initialState: LLMState = {
  items: [],
  loading: false,
  error: null,
  ollamaModels: [],
}

export const llmSlice = createSlice({
  name: 'llms',
  initialState,
  reducers: {
    setLLMs: (state, action: PayloadAction<LLMModelConfig[]>) => {
      state.items = action.payload
      state.loading = false
      state.error = null
    },

    addLLM: (state, action: PayloadAction<LLMModelConfig>) => {
      state.items.push(action.payload)
    },
    updateLLM: (state, action: PayloadAction<LLMModelConfig>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteLLM: (state, action: PayloadAction<string>) => {
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

export const { setLLMs, addLLM, updateLLM, deleteLLM, setLoading, setError } = llmSlice.actions

export default llmSlice.reducer
