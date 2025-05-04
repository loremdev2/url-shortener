import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';

/**
 * Interface defining the hook's return shape.
 *
 * @template T - The type of fetched data.
 */
export interface UseFetchResult<T> {
  /** The fetched data or null if not yet loaded */
  data: T | null;
  /** Any error encountered during request or null */
  error: Error | null;
  /** Loading state flag */
  loading: boolean;
  /** Function to manually re-trigger the fetch */
  refetch: () => void;
}

/**
 * useFetch - A custom React hook for fetching data from an API using Axios.
 *
 * @template T - The type of the response data.
 * @param url - The URL to fetch data from.
 * @param config - Optional Axios request configuration (headers, params, etc.).
 * @returns A UseFetchResult<T> containing data, error, loading, and refetch.
 */
function useFetch<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): UseFetchResult<T> {
  // State to hold the fetched data
  const [data, setData] = useState<T | null>(null);
  // State to hold any error thrown during fetch
  const [error, setError] = useState<Error | null>(null);
  // State to track loading status
  const [loading, setLoading] = useState<boolean>(false);
  // Internal counter to trigger re-fetch when incremented
  const [trigger, setTrigger] = useState<number>(0);

  /**
   * refetch - Increment trigger state to re-run useEffect and fetch data again.
   */
  const refetch = useCallback(() => {
    setTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    // Create a cancel token to allow request cancellation on cleanup
    const cancelToken: CancelTokenSource = axios.CancelToken.source();

    /**
     * fetchData - Async function to perform the Axios request.
     */
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.request<T>({ url, cancelToken: cancelToken.token, ...config });
        setData(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err as Error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup: cancel ongoing request if component unmounts
    return () => cancelToken.cancel('Request canceled by cleanup');
  }, [url, config, trigger]);

  return { data, error, loading, refetch };
}

export default useFetch;
