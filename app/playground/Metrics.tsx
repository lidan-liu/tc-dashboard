'use client';

import {
  AreaChart
} from '@tremor/react';
import {
  TCMetricType,
} from './hooks/useTCMetrics';
import { useEffect, useState } from 'react';

type ChartData = {
  time: string;
  processCpu: number;
  systemCpu: number;
};

const convertData = (arr: TCMetricType[]): ChartData => {
  const processCpu = arr.find((m) => m.name === 'cpu.usage.process');
  const systemCpu = arr.find((m) => m.name === 'cpu.usage.system');
  return {
    time: new Date().toString(),
    processCpu: processCpu ? processCpu.metricValues.metricValue[0].value : 0,
    systemCpu: systemCpu ? systemCpu.metricValues.metricValue[0].value : 0
  };
};

type MetricsState = Array<ChartData>;

export default function Metrics() {
  const [metricState, setMetricState] = useState<MetricsState>();
  const [id, setId] = useState<number>();

  const getData = async () => {
    const r = new Request(`http://localhost:3000/api/tc/metrics`);
    const response = await fetch(r);
    const json = await response.json();
    setMetricState((metrics) => {
      const converted = convertData(json.metric);
      if (metrics && metrics.length > 0) {
        return [...metrics, converted];
      }
      return [converted];
    });
  };

  useEffect(() => {
    if (!id) {
      getData();

      const id = window.setInterval(() => {
        getData();
      }, 10000);

      setId(id);
    }

    return clearInterval(id);
  }, [id]);

  if (!metricState || metricState?.length <= 0) return null;

  return (
    <AreaChart
      index={'time'}
      className="mt-4 h-80"
      data={metricState}
      categories={['processCpu', 'systemCpu']}
      colors={['blue', 'green']}
      yAxisWidth={60}
      showXAxis={true}
    ></AreaChart>
  );
}
