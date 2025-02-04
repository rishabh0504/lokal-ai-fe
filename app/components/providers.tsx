'use client'
import { Provider } from 'react-redux'
import { ReactNode } from 'react'
import { store } from '../store/store'

interface Props {
  children: ReactNode
}

export function ReduxProvider({ children }: Props) {
  return <Provider store={store}>{children}</Provider>
}
