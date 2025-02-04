import { Agent, Items } from '@/app/utils/types'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AgentState {
  items: Items[]
  loading: boolean
  error: string | null
}

const initialState: AgentState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchAgents = createAsyncThunk('agents/fetchAgents', async () => {
  const response = await fetch('http://localhost:3001/agents')
  if (!response.ok) {
    throw new Error('Failed to fetch LLMs')
  }
  const data: Agent[] = await response.json()
  const agents = data.map((eachItem) => ({ name: eachItem.agentName, url: '#', component: null }))

  return agents
})

export const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAgents.fulfilled, (state, action: PayloadAction<Items[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch LLMs'
      })
  },
})

export default agentsSlice.reducer
