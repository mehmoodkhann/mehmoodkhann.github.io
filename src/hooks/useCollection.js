import { useCallback, useEffect, useState } from "react";
function useService(service, list) {
  const [data, setData] = useState(() => {
    try {
      return service.getSnapshot ? service.getSnapshot() : list ? [] : null;
    } catch {
      return list ? [] : null;
    }
  });
  const [loading, setLoading] = useState(!service.getSnapshot);
  const [error, setError] = useState(null);
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await (list ? service.list() : service.get()));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [service, list]);
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const value = await (list ? service.list() : service.get());
        if (active) {
          setData(value);
          setError(null);
        }
      } catch (err) {
        if (active) setError(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    refresh();
    window.addEventListener("portfolio:content", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      active = false;
      window.removeEventListener("portfolio:content", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [service, list]);
  return { data, loading, error, refetch, setData };
}
export function useCollection(service) {
  return useService(service, true);
}
export function useObject(service) {
  return useService(service, false);
}
