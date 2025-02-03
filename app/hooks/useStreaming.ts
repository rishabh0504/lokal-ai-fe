// src/hooks/useStreaming.tsx
import { useState, useCallback, useRef } from 'react'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

type BodyType<T> = T | string | null

const useStreaming = <T>(): {
  data: T | null
  loading: boolean
  error: Error | null
  fetchData: <B>(
    fetchUrl: string,
    method?: HttpMethod,
    body?: BodyType<B>,
    headers?: HeadersInit,
  ) => Promise<void>
  refetch: <B>(
    newUrl?: string,
    method?: HttpMethod,
    body?: BodyType<B>,
    headers?: HeadersInit,
  ) => Promise<void>
  get: (requestUrl?: string, headers?: HeadersInit) => Promise<void>
  post: <B>(body: BodyType<B>, requestUrl?: string, headers?: HeadersInit) => Promise<void>
  put: <B>(body: BodyType<B>, requestUrl?: string, headers?: HeadersInit) => Promise<void>
  del: (requestUrl?: string, headers?: HeadersInit) => Promise<void>
  patch: <B>(body: BodyType<B>, requestUrl?: string, headers?: HeadersInit) => Promise<void>
  cancel: () => void
  updateUrl: (newUrl: string) => void
} => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [url, setUrl] = useState<string>('') //Set the default value of url to an empty string.
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(
    async <B>(
      fetchUrl: string,
      method: HttpMethod = 'GET',
      body: BodyType<B> | null = null,
      headers: HeadersInit = {},
    ): Promise<void> => {
      setLoading(true)
      setError(null)

      const abortController = new AbortController()
      abortControllerRef.current = abortController
      const { signal } = abortController

      try {
        const fetchOptions: RequestInit = {
          method: method,
          headers: {
            'Content-Type': 'application/octet-stream',
            ...headers,
          },
          signal,
        }

        if (body) {
          fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
        }

        const response = await fetch(fetchUrl, fetchOptions)

        if (!response.ok) {
          const message = await response.text()
          throw new Error(`HTTP error! status: ${response.status} ${message}`)
        }

        if (!response.body) {
          throw new Error('Response body is not available')
        }

        const reader = response.body.getReader()
        let accumulatedData = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }

          const textChunk = new TextDecoder().decode(value)
          accumulatedData += textChunk
          setData(accumulatedData as T)
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          if (e.name !== 'AbortError') {
            setError(e)
          }
        } else {
          if (String(e) !== 'AbortError') {
            // check to ensure that we don't throw an error on an abort.
            setError(new Error(String(e)))
          }
        }
        setData(null)
      } finally {
        setLoading(false)
        abortControllerRef.current = null
      }
    },
    [],
  )

  const refetch = useCallback(
    async <B>(
      newUrl: string = url,
      method: HttpMethod = 'GET',
      body: BodyType<B> | null = null,
      headers: HeadersInit = {},
    ): Promise<void> => {
      return await fetchData(newUrl, method, body, headers)
    },
    [fetchData, url],
  )

  const makeRequest = useCallback(
    async <B>(
      method: HttpMethod,
      body: BodyType<B> | null = null,
      requestUrl: string = url,
      headers: HeadersInit = {},
    ): Promise<void> => {
      return await fetchData(requestUrl, method, body, headers)
    },
    [fetchData, url],
  )

  const get = useCallback(
    async (requestUrl: string = url, headers: HeadersInit = {}): Promise<void> => {
      return await makeRequest('GET', null, requestUrl, headers)
    },
    [makeRequest, url],
  )

  const post = useCallback(
    async <B>(
      body: BodyType<B>,
      requestUrl: string = url,
      headers: HeadersInit = {},
    ): Promise<void> => {
      return await makeRequest('POST', body, requestUrl, headers)
    },
    [makeRequest, url],
  )

  const put = useCallback(
    async <B>(
      body: BodyType<B>,
      requestUrl: string = url,
      headers: HeadersInit = {},
    ): Promise<void> => {
      return await makeRequest('PUT', body, requestUrl, headers)
    },
    [makeRequest, url],
  )

  const del = useCallback(
    async (requestUrl: string = url, headers: HeadersInit = {}): Promise<void> => {
      return await makeRequest('DELETE', null, requestUrl, headers)
    },
    [makeRequest, url],
  )

  const patch = useCallback(
    async <B>(
      body: BodyType<B>,
      requestUrl: string = url,
      headers: HeadersInit = {},
    ): Promise<void> => {
      return await makeRequest('PATCH', body, requestUrl, headers)
    },
    [makeRequest, url],
  )

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setLoading(false)
    }
  }, [])

  const updateUrl = useCallback(
    (newUrl: string): void => {
      setUrl(newUrl)
    },
    [setUrl],
  )

  return {
    data,
    loading,
    error,
    fetchData,
    refetch,
    get,
    post,
    put,
    del,
    patch,
    cancel,
    updateUrl,
  }
}

export default useStreaming
