import { useFetchData } from "./useFetchData"
import { useMemo } from "react"

export interface TCBuildType {
    id: string
    buildTypeId: string
    status: string
    state: string
    branchName: string
    webUrl: string
    finishOnAgentDate: string

}

export interface TCBuildsResponseType {
    build: Array<TCBuildType>
    count: number
}

type TParams = {
    branch: string,
    date: Date | null
    build: string
}

const convertToTCDate = (date: Date) => {
    const dateString = date.toISOString().slice(0,10).replace(/-/g,"")
    return `${dateString}T000000%2b0100`
}

const yyyymmdd = (date: Date) => {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var mm = m < 10 ? '0' + m : m;
    var dd = d < 10 ? '0' + d : d;
    return `${y}${m}${d}T000000%2b0100`
}

export const useTCBuilds = ({
    branch,
    date,
    build = 'DesktopWeb_Tests_UiAcceptanceTestsMocked'
}: TParams) => {
    if (!date) {
        throw Error('needs date')
    }

    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1)

    const start = yyyymmdd(date);
    const end = yyyymmdd(nextDay);

    const buildsRequest = useMemo(() => {
        return new Request(`http://localhost:3000/api/tc/builds?branch=${branch}&start=${start}&end=${end}&build=${build}`);
    }, [branch, start, end, build])

    return useFetchData<TCBuildsResponseType>(buildsRequest, true)
}