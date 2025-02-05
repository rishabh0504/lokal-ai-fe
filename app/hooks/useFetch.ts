import { useState, useCallback } from 'react'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

const useFetch = <T, BodyType = null>(
  initialUrl: string,
): {
  data: T | null
  loading: boolean
  error: Error | null
  fetchData: <B = BodyType>(
    fetchUrl: string,
    method?: HttpMethod,
    body?: B,
    headers?: HeadersInit,
  ) => Promise<T | null>
  refetch: <B = BodyType>(
    newUrl?: string,
    method?: HttpMethod,
    body?: B,
    headers?: HeadersInit,
  ) => Promise<T | null>
  get: (requestUrl?: string, headers?: HeadersInit) => Promise<T | null>
  post: <B = BodyType>(body: B, requestUrl?: string, headers?: HeadersInit) => Promise<T | null>
  put: <B = BodyType>(body: B, requestUrl?: string, headers?: HeadersInit) => Promise<T | null>
  del: (requestUrl?: string, headers?: HeadersInit) => Promise<T | null>
  patch: <B = BodyType>(body: B, requestUrl?: string, headers?: HeadersInit) => Promise<T | null>
  updateUrl: (newUrl: string) => void
} => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [url, setUrl] = useState<string>(initialUrl)

  const fetchData = useCallback(
    async <B = BodyType>(
      fetchUrl: string,
      method: HttpMethod = 'GET',
      body: B | null = null,
      headers: HeadersInit = {},
    ): Promise<T | null> => {
      setLoading(true)
      setError(null)

      try {
        const fetchOptions: RequestInit = {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        }

        if (body) {
          fetchOptions.body = JSON.stringify(body)
        }

        const response = await fetch(fetchUrl, fetchOptions)

        if (!response.ok) {
          const message = await response.text()
          throw new Error(`HTTP error! status: ${response.status} ${message}`)
        }

        const responseData: T = await response.json()
        setData(responseData)
        return responseData
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e)
        } else {
          setError(new Error(String(e)))
        }
        setData(null)
        return null
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const refetch = useCallback(
    async <B = BodyType>(
      newUrl: string = url,
      method: HttpMethod = 'GET',
      body: B | null = null,
      headers: HeadersInit = {},
    ): Promise<T | null> => {
      return await fetchData(newUrl, method, body, headers)
    },
    [fetchData, url],
  )

  const makeRequest = useCallback(
    async <B = BodyType>(
      method: HttpMethod,
      body: B | null = null,
      requestUrl: string = url,
      headers: HeadersInit = {},
    ): Promise<T | null> => {
      return await fetchData(requestUrl, method, body, headers)
    },
    [fetchData, url],
  )

  const get = useCallback(
    async (requestUrl: string = url, headers: HeadersInit = {}): Promise<T | null> => {
      return await makeRequest('GET', null, requestUrl, headers)
    },
    [makeRequest, url],
  )

  const post = useCallback(
    async <B = BodyType>(
      body: B,
      requestUrl: string = url,
      headers: HeadersInit = {},
    ): Promise<T | null> => {
      return await makeRequest('POST', body, requestUrl, headers)
    },
    [makeRequest, url],
  )

  const put = useCallback(
    async <B = BodyType>(
      body: B,
      requestUrl: string = url,
      headers: HeadersInit = {},
    ): Promise<T | null> => {
      return await makeRequest('PUT', body, requestUrl, headers)
    },
    [makeRequest, url],
  )

  const del = useCallback(
    async (requestUrl: string = url, headers: HeadersInit = {}): Promise<T | null> => {
      return await makeRequest('DELETE', null, requestUrl, headers)
    },
    [makeRequest, url],
  )

  const patch = useCallback(
    async <B = BodyType>(
      body: B,
      requestUrl: string = url,
      headers: HeadersInit = {},
    ): Promise<T | null> => {
      return await makeRequest('PATCH', body, requestUrl, headers)
    },
    [makeRequest, url],
  )

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
    updateUrl,
  }
}

export default useFetch
