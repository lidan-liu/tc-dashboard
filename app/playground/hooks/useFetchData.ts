import { useEffect } from 'react';
import { useFetch } from './useFetch';

export const useFetchData = <R>(
    request: Request,
    enable = false,
    errorHandler?: (response: Response) => void
) => {
    const { data, loading, error, fetchData } = useFetch<R>(
        request,
        errorHandler
    );

    useEffect(() => {
        if (enable) {
            fetchData();
        }
    }, [request, enable, fetchData]);

    return {
        fetchData,
        data,
        loading,
        error,
    };
};
