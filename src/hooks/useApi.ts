import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api/api';

export const useApi = <T>(url: string, options?: AxiosRequestConfig) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const fetchData = useCallback(
    async (controller: AbortController) => {
      setLoading(true);

      try {
        const response: AxiosResponse<T | null> = await api(url, {
          ...options,
          signal: controller.signal,
        });
        setData(response.data);
      } catch (error) {
        setError(error);
      }
    },
    [url, options],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchData(controller);

    return () => {
      controller.abort();
    };
  }, [fetchData]);

  return { data, loading, error };
};
