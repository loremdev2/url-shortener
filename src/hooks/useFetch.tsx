// src/hooks/useFetch.ts
import { useState } from "react";

type Callback<T, A extends any[]> = (...args: A) => Promise<T>;

interface UseFetchResult<T, A extends any[]> {
  data: T | null;
  loading: boolean;
  error: unknown;
  fn: (...args: A) => Promise<void>;
}

function useFetch<T, A extends any[] = any[]>(
  cb: Callback<T, A>
): UseFetchResult<T, A> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const fn = async (...args: A): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await cb(...args);
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
}

export default useFetch;
