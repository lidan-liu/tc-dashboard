import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

type TDateRange = {
    date: Date | null
    setDate: Dispatch<SetStateAction<Date>>
}

export const DateRangeContext = createContext<TDateRange>({
    date: null,
    setDate: () => {}
});

export const DateRangeProvider = ({children}: {children: ReactNode}) => {
    const [date, setDate] = useState(new Date())
    return (
        <DateRangeContext.Provider value={{
            date,
            setDate
        }}>
            {children}
        </DateRangeContext.Provider>
    )
}
