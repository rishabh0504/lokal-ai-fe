import { Agent } from '@/app/(routes)/agent/types/type'
import { API_CONFIG } from '@/app/utils/config'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AgentState {
  items: Agent[]
  loading: boolean
  error: string | null
  activeAgent: Partial<Agent> | null
}

const initialState: AgentState = {
  items: [],
  loading: false,
  error: null,
  activeAgent: null,
}

export const fetchAgents = createAsyncThunk('agents/fetchAgents', async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.agents.get}`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch LLMs')
  }
  const data: Agent[] = await response.json()
  return data
})

export const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    setActiveAgent: (state, action: PayloadAction<Agent | null>) => {
      state.activeAgent = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAgents.fulfilled, (state, action: PayloadAction<Agent[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch LLMs'
      })
  },
})

export const { setActiveAgent } = agentsSlice.actions

export default agentsSlice.reducer
