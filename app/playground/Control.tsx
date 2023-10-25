import {
  Button,
  DatePicker,
  DatePickerValue,
  NumberInput
} from '@tremor/react';
import {
  Dispatch,
  MouseEventHandler,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState
} from 'react';
import { BranchToggle } from './Branch/component';
import { DateRange } from './DateRange/component';

type CountContextType = {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
};

export const CountContext = createContext<CountContextType>({
  count: 0,
  setCount: () => {}
});

export const CountProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState<number>(100);
  return (
    <CountContext.Provider
      value={{
        count,
        setCount
      }}
    >
      {children}
    </CountContext.Provider>
  );
};

export const ControlCount = () => {
  const { count, setCount } = useContext(CountContext);

  const setCountCB: MouseEventHandler<HTMLButtonElement> = (e) => {
    setCount;
  };

  const onChange = () => {
    console.log(9999, 'on change');
  };
  return (
    <div className="flex justify-between">
      <NumberInput defaultValue={count} onValueChange={onChange} />
      <Button size="xs" onClick={setCountCB}>
        update count
      </Button>
    </div>
  );
};

export const Control = () => {

  return (
    <div className="flex justify-between">
      <BranchToggle />
      <DateRange />
    </div>
  );
};
