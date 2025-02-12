import { LLMModel } from '@/app/(routes)/llm/types/type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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

export const llmSlice = createSlice({
  name: 'llms',
  initialState,
  reducers: {
    setLLMs: (state, action: PayloadAction<LLMModel[]>) => {
      state.items = action.payload
      state.loading = false // Assuming the data is loaded when this action is dispatched
      state.error = null
    },
    addLLM: (state, action: PayloadAction<LLMModel>) => {
      state.items.push(action.payload)
    },
    updateLLM: (state, action: PayloadAction<LLMModel>) => {
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
