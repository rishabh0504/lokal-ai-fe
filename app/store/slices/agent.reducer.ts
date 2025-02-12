import { Agent } from '@/app/(routes)/agent/types/type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AgentState {
  items: Agent[]
  loading: boolean
  error: string | null
  activeAgent: Agent | null // Ensure activeAgent is an Agent or null
}

const initialState: AgentState = {
  items: [],
  loading: false,
  error: null,
  activeAgent: null,
}

export const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    setAgents: (state, action: PayloadAction<Agent[]>) => {
      state.items = action.payload
      state.loading = false
      state.error = null
    },
    addAgent: (state, action: PayloadAction<Agent>) => {
      state.items.push(action.payload)
    },
    updateAgent: (state, action: PayloadAction<Agent>) => {
      const index = state.items.findIndex((agent) => agent.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteAgent: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((agent) => agent.id !== action.payload)
    },
    setActiveAgent: (state, action: PayloadAction<Agent | null>) => {
      state.activeAgent = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setAgents,
  addAgent,
  updateAgent,
  deleteAgent,
  setActiveAgent,
  setLoading,
  setError,
} = agentsSlice.actions

export default agentsSlice.reducer
