import { useState, useCallback } from 'react';

interface APIState<S> {
    loading: boolean;
    data: S | null;
    error: Error | null;
}

export const useFetch = <R>(
    request: Request,
    errorHandler?: (response: Response) => void
) => {
    const [state, setState] = useState<APIState<R>>({
        loading: false,
        data: null,
        error: null,
    });

    const fetchData = useCallback(async () => {
        setState({
            loading: true,
            data: null,
            error: null,
        });

        try {
            const response = await fetch(request);
            const { ok, statusText } = response;

            if (ok) {
                return setState({
                    loading: false,
                    data: (await response.json()) as R,
                    error: null,
                });
            }

            if (errorHandler) {
                errorHandler(response);
            }

            throw new Error(statusText);
        } catch (e) {
            return setState({
                loading: false,
                data: null,
                error: e as Error,
            });
        }
    }, [errorHandler, request]);

    return {
        loading: state.loading,
        data: state.data,
        error: state.error,
        fetchData,
    };
};
