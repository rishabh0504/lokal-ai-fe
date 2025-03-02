'use client'
import { configureStore } from '@reduxjs/toolkit'

import agentReducer from './slices/agent.reducer'
import llmReducer from './slices/llm.reducer'
import ollamaModelReducer from './slices/ollama-models.reducer'
import sessionReducer from './slices/session.reducer'
import toolConfigReducer from './slices/tool-config.reducer'

export const store = configureStore({
  reducer: {
    llms: llmReducer,
    agents: agentReducer,
    sessions: sessionReducer,
    toolConfigs: toolConfigReducer,
    ollamaModels: ollamaModelReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
