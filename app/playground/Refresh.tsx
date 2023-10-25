import { Button } from "@tremor/react"

export const Refresh = ({cb}: {cb: () => void}) => {
    return (
        <Button size="xs" onClick={cb}>refresh</Button>
    )
}