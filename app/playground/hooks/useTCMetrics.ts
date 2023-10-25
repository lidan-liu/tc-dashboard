import { useFetch } from "./useFetch"
import { useFetchData } from "./useFetchData"
import { useMemo } from "react"

export interface TCMetricType {
    name: string,
    description: string
    metricValues: {
        count: number
        metricValue: Array<{
            name: string
            value: number
        }>
    }
    metricTags: {
        count: number
        metricTag: []
    }
}

export interface TCMetricsResponseType {
    metric: TCMetricType[]
    count: number
}

export const useTCMetrics = () => {

    const r = useMemo(() => {
        return new Request(`http://localhost:3000/api/tc/metrics`);
    }, [])

    return useFetchData<TCMetricsResponseType>(r, true)
}

export const useTCMetricsCB = () => {
    const r = useMemo(() => {
        return new Request(`http://localhost:3000/api/tc/metrics`);
    }, [])

    const { fetchData } = useFetch(r)

    return fetchData;
}