import { DatePicker, DatePickerValue } from "@tremor/react";
import { useContext } from "react";
import { DateRangeContext } from "../Context";

export const DateRange = () => {
    const { setDate } = useContext(DateRangeContext);
    const today = new Date();
    const changeValue = (d: DatePickerValue) => {
      if (d) {
        setDate(d);
      }
      
    }
  return (
    <DatePicker
      className="max-w-sm mx-auto"
      minDate={new Date(2023, 9, 1)}
      maxDate={today}
      onValueChange={changeValue}
    />
  );
};
