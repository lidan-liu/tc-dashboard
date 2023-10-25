'use client';

import { BranchProvider } from './Branch/Context';
import { Control } from './Control';
import { DateRangeProvider } from './DateRange/Context';
import Metrics from './Metrics';
import Builds from './builds';

import {
  Card,
  Grid,
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels
} from '@tremor/react';

export default function PlaygroundPage() {
  return (
    <BranchProvider>
      <DateRangeProvider>
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
          <Title>Teamcity dashboard</Title>
          <Metrics />
          <Control />
          <TabGroup className="mt-6">
            <TabList>
              <Tab>UI tests</Tab>
              <Tab>Unit tests</Tab>
              <Tab>Build PR</Tab>
              <Tab>Build master</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Builds build={'DesktopWeb_Tests_UiAcceptanceTestsMocked'} />
              </TabPanel>
              <TabPanel>
                <Builds build={'DesktopWeb_WorkInProgress_BuildPullRequests'} />
              </TabPanel>
              <TabPanel>
                <Builds build={'DesktopWeb_BuildMaster'} />
              </TabPanel>
              <TabPanel>
                <Builds build={'DesktopWeb_BuildPr'} />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </main>
      </DateRangeProvider>
    </BranchProvider>
  );
}
