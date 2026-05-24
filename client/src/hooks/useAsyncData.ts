import { useCallback, useEffect, useState } from "react";

export interface UseAsyncDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function resolveAsyncError(
  error: unknown,
  fallback = "Une erreur est survenue.",
): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: ReadonlyArray<unknown>,
  errorFallback = "Une erreur est survenue.",
): UseAsyncDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err: unknown) => {
        setData(null);
        setError(resolveAsyncError(err, errorFallback));
      })
      .finally(() => {
        setLoading(false);
      });
  }, deps);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
}
