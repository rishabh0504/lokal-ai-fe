'use client'
import agentReducer from './slices/agent.reducer'
import llmReducer from './slices/llm.reducer'
import sessionReducer from './slices/session.reducer'

import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    llms: llmReducer,
    agents: agentReducer,
    sessions: sessionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
