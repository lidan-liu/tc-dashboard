'use client';

import { Card, AreaChart, Title, Text, Metric, Divider } from '@tremor/react';
import { useTCBuilds } from './hooks/useTCBuilds';
import mocked from './mock.json';
import { useContext } from 'react';
import { MasterBranchContext } from './Branch/Context';
import { TCBuildType } from './hooks/useTCBuilds';
import { DateRangeContext } from './DateRange/Context';
import { useTCMetrics } from './hooks/useTCMetrics';
import { Refresh } from './Refresh';

type LessThan<N extends number, A extends any[] = []> = N extends A['length']
  ? A[number]
  : LessThan<N, [...A, A['length']]>;

type NumericRange<F extends number, T extends number> = Exclude<
  T | LessThan<T>,
  LessThan<F>
>;

type THours = NumericRange<0, 24>;
type TDate = NumericRange<1, 31>;
type TMonth = NumericRange<1, 12>;

type TBuild = {
  success: number;
  fail: number;
  total: number;
  date: Date;
};

const monthsName = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

const convertDate = (dateString: string): Date => {
  const y = dateString.slice(0, 4);
  const m = dateString.slice(4, 6);
  const d = dateString.slice(6, 8);
  const t = dateString.slice(9, 15);
  const days = [y, m, d].join('-');
  const time = t.match(/.{1,2}/g)?.join(':');
  const convertedDate = [days, 'T', time, 'Z'].join('');
  const dateObj = new Date(convertedDate);
  return dateObj;
};

const getMedian = (arr: any[]): string => {
  const sorted = [...arr].sort((a, b) => {
    return a.rate - b.rate;
  });
  const half = Math.floor(sorted.length / 2);

  const medianValue =
    sorted.length <= 0
      ? 0
      : sorted.length % 2
      ? sorted[half].rate
      : (sorted[half - 1].rate + sorted[half].rate) / 2;

  return `${medianValue.toFixed(2) * 100}%`;
};

const getTotalFailure = (arr: TCBuildType[]): number => {
  return arr.filter((b) => b.status === 'FAILURE').length;
};

export default function Builds({ build }: { build: string }) {
  const { branch } = useContext(MasterBranchContext);
  const { date } = useContext(DateRangeContext);
  const { data, fetchData } = useTCBuilds({
    branch,
    date,
    build
  });

  if (!data) return null;

  const totalFailure = getTotalFailure(data.build);
  const averageFailureRate = `${(
    (totalFailure / data.build.length) *
    100
  ).toFixed(2)}%`;

  const mapData = data.build.reduce((acc, currentBuild) => {
    const convertedDate = convertDate(currentBuild.finishOnAgentDate);

    const hours = convertedDate.getHours() as THours;
    const date = convertedDate.getDate() as TDate;
    const month = convertedDate.getMonth() as TMonth;

    const xAxis = `${monthsName[month]}-${date}-${hours}`;

    if (acc.has(xAxis)) {
      const buildValue = acc.get(xAxis) as TBuild;
      buildValue.total += 1;
      if (currentBuild.status === 'SUCCESS') {
        buildValue.success += 1;
      } else if (currentBuild.status === 'FAILURE') {
        buildValue.fail += 1;
      }
    } else {
      acc.set(xAxis, {
        date: convertedDate,
        total: 1,
        fail: currentBuild.status === 'FAILURE' ? 1 : 0,
        success: currentBuild.status === 'SUCCESS' ? 1 : 0
      });
    }

    return acc;
  }, new Map<string, TBuild>());

  const mappedData = Array.from(mapData, (entry) => {
    return {
      date: entry[1].date,
      time: entry[0],
      success: entry[1].success,
      total: entry[1].total,
      fail: entry[1].fail,
      rate: entry[1].fail / entry[1].total
    };
  });

  const sorted = mappedData.sort((a, b) => a.date.valueOf() - b.date.valueOf());
  const medianRate = getMedian(sorted);

  return (
    <Card className="mt-8">
      <div className="flex justify-between">
        <Card
          className='p-3 max-w-xs'
        >
          <Title>DWEB Builds</Title>
          <Text>Dweb {build}</Text>
        </Card>
        <Card
          className='p-3 max-w-xs'
        ><Refresh cb={fetchData} /></Card>
        
      </div>
      <Divider></Divider>
      <div className="flex justify-between">
        <Card
          className="max-w-xs mx-auto p-2"
          decoration="top"
          decorationColor="indigo"
        >
          <Text>Total</Text>
          <Metric className='text-xs'>{`${data.build.length} records`}</Metric>
          <Metric className='text-xs'>{`${sorted.length} time slots`}</Metric>
        </Card>
        <Card
          className="max-w-xs mx-auto p-2"
          decoration="top"
          decorationColor="indigo"
        >
          <Text>Failure rate</Text>
          <Metric className='text-xs'>{`Average: ${averageFailureRate}`}</Metric>
          <Metric className='text-xs'>{`Median: ${medianRate}`}</Metric>
        </Card>
        <Card
          className="max-w-xs mx-auto p-2"
          decoration="top"
          decorationColor="indigo"
        >
          <Text>Branch:</Text>
          <Metric className='text-xs'>{branch === 'master' ? 'Master' : 'All branches'}</Metric>
        </Card>
      </div>
      <AreaChart
        index={'time'}
        className="mt-4 h-80"
        data={sorted}
        categories={['total', 'success', 'fail']}
        colors={['blue', 'green', 'red']}
        yAxisWidth={60}
        showXAxis={true}
      />
    </Card>
  );
}
