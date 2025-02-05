'use client'
import llmReducer from './slices/llm.reducer'
import agentReducer from './slices/agent.reducer'

import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    llms: llmReducer,
    agents: agentReducer,
  },
})

// Infer the RootState type from store.getState
export type RootState = ReturnType<typeof store.getState>
// Infer Dispatch type from store.dispatch
export type AppDispatch = typeof store.dispatch
