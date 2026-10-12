// SPDX-License-Identifier: LicenseRef-Blockscout
// Modified for Gramchain on 2026-10-12: new file, "Network Metrics" panel of the home page.

import type { GridProps } from '@chakra-ui/react';
import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import useStatsQuery from 'src/slices/chain/stats/useStatsQuery';
import { currencyUnits } from 'src/slices/chain/units';
import useChartDataQuery from 'src/slices/home/hooks/useChartDataQuery';

import config from 'src/config';

import { Button } from 'src/toolkit/chakra/button';
import { Heading } from 'src/toolkit/chakra/heading';
import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { SECOND } from 'src/toolkit/utils/consts';

import { MiniBarChart, MiniLineChart } from './MiniCharts';

const BLOCKS_IN_BAR_CHART = 24;
const EMPTY_VALUES: Array<number> = [];

const compactFormatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 });
const decimalFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const formatSeconds = (value: number): string => `${ decimalFormatter.format(value) }s`;
const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

type Summary = {
  readonly high: number;
  readonly low: number;
  readonly average: number;
};

const summarize = (values: ReadonlyArray<number>): Summary | undefined => {
  if (values.length === 0) {
    return;
  }
  return {
    high: Math.max(...values),
    low: Math.min(...values),
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
  };
};

const Card = (props: GridProps) => (
  <Grid
    borderWidth="1px"
    borderColor="border.divider"
    borderRadius="lg"
    bgColor={{ _light: 'gray.50', _dark: 'whiteAlpha.50' }}
    p={{ base: 4, lg: 5 }}
    { ...props }
  />
);

type MetricColumnProps = {
  readonly title: string;
  readonly value: string;
  readonly summary: Summary | undefined;
  readonly format: (value: number) => string;
  readonly isLoading: boolean;
  readonly chart: React.ReactNode;
};

const MetricColumn = ({ title, value, summary, format, isLoading, chart }: MetricColumnProps) => (
  <Flex direction="column" minW={ 0 }>
    <Text textStyle="xs" color="text.secondary">{ title }</Text>
    <Skeleton loading={ isLoading } mt={ 1 } textStyle="heading.lg" fontWeight="semibold" w="fit-content">{ value }</Skeleton>
    <Grid mt={ 4 } gridTemplateColumns="repeat(3, auto)" justifyContent="start" columnGap={ 6 } rowGap={ 1 } textStyle="xs">
      <Text color="text.secondary">Period high</Text>
      <Text color="text.secondary">Period low</Text>
      <Text color="text.secondary">Average</Text>
      <Skeleton loading={ isLoading }>{ summary ? format(summary.high) : '—' }</Skeleton>
      <Skeleton loading={ isLoading }>{ summary ? format(summary.low) : '—' }</Skeleton>
      <Skeleton loading={ isLoading }>{ summary ? format(summary.average) : '—' }</Skeleton>
    </Grid>
    <Skeleton loading={ isLoading } mt="auto" pt={ 4 }>{ chart }</Skeleton>
  </Flex>
);

type InfoRowProps = {
  readonly label: string;
  readonly value: string;
  readonly isLoading: boolean;
};

const InfoRow = ({ label, value, isLoading }: InfoRowProps) => (
  <Flex justifyContent="space-between" alignItems="center" textStyle="sm" columnGap={ 4 }>
    <Text color="text.secondary">{ label }</Text>
    <Skeleton loading={ isLoading } fontWeight="medium">{ value }</Skeleton>
  </Flex>
);

const NetworkMetrics = (props: GridProps) => {
  const statsQuery = useStatsQuery();
  const dailyTxs = useChartDataQuery('daily_txs');
  const coinPrice = useChartDataQuery('coin_price');
  const blocksQuery = useApiQuery('core:blocks', {
    queryParams: { type: 'block' },
    queryOptions: { refetchOnMount: false },
  });

  const dailyTxsValues = React.useMemo(
    () => dailyTxs.data[0]?.items.map((item) => item.value) ?? EMPTY_VALUES,
    [ dailyTxs.data ],
  );
  const coinPriceValues = React.useMemo(
    () => coinPrice.data[0]?.items.map((item) => item.value) ?? EMPTY_VALUES,
    [ coinPrice.data ],
  );
  const blockTimeValues = React.useMemo(() => {
    const timestamps = blocksQuery.data?.items.slice(0, BLOCKS_IN_BAR_CHART + 1).map((block) => new Date(block.timestamp).getTime()).reverse();
    if (!timestamps || timestamps.length < 2) {
      return EMPTY_VALUES;
    }
    return timestamps.slice(1).map((timestamp, index) => Math.max(0, (timestamp - timestamps[index]) / SECOND));
  }, [ blocksQuery.data ]);

  const stats = statsQuery.data;
  const isStatsLoading = statsQuery.isPlaceholderData;
  const latestDailyTxs = dailyTxsValues.at(-1);
  const latestBlockTime = blockTimeValues.at(-1);
  const averageGas = stats?.gas_prices?.average;
  const averageGasPrice = typeof averageGas === 'number' ? averageGas : averageGas?.price;
  const coinPriceValue = Number(stats?.coin_price);
  const hasCoinPrice = Number.isFinite(coinPriceValue) && coinPriceValue > 0;

  return (
    <Grid gridTemplateColumns={{ base: '1fr', lg: 'minmax(0, 2fr) minmax(0, 1fr)' }} gap={ 3 } { ...props }>
      <Card gridRow={{ lg: 'span 2' }} gridTemplateRows="auto 1fr" rowGap={ 6 }>
        <Flex justifyContent="space-between" alignItems="center" columnGap={ 3 }>
          <Heading level="3">Network Metrics</Heading>
          { config.features.stats.isEnabled && (
            <Link href={ route({ pathname: '/stats' }) } asChild>
              <Button size="sm" variant="subtle">View Metrics</Button>
            </Link>
          ) }
        </Flex>
        <Grid gridTemplateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))' }} columnGap={ 8 } rowGap={ 8 }>
          <MetricColumn
            title="Daily transactions"
            value={ latestDailyTxs === undefined ? '—' : decimalFormatter.format(latestDailyTxs) }
            summary={ summarize(dailyTxsValues) }
            format={ compactFormatter.format }
            isLoading={ dailyTxs.isPending }
            chart={ <MiniLineChart values={ dailyTxsValues }/> }
          />
          <MetricColumn
            title="Block time"
            value={ latestBlockTime === undefined ? '—' : `${ decimalFormatter.format(latestBlockTime) }s` }
            summary={ summarize(blockTimeValues) }
            format={ formatSeconds }
            isLoading={ blocksQuery.isPending }
            chart={ <MiniBarChart values={ blockTimeValues }/> }
          />
        </Grid>
      </Card>

      <Card rowGap={ 3 } alignContent="start">
        <InfoRow
          label="Average block time"
          value={ stats ? `${ decimalFormatter.format(stats.average_block_time / SECOND) }s` : '—' }
          isLoading={ isStatsLoading }
        />
        <InfoRow
          label="Network utilization"
          value={ typeof stats?.network_utilization_percentage === 'number' ? `${ stats.network_utilization_percentage.toFixed(2) }%` : '—' }
          isLoading={ isStatsLoading }
        />
        <InfoRow
          label="Average gas price"
          value={ averageGasPrice ? `${ decimalFormatter.format(averageGasPrice) } ${ currencyUnits.gwei }` : '—' }
          isLoading={ isStatsLoading }
        />
      </Card>

      { hasCoinPrice || isStatsLoading ? (
        <Card rowGap={ 3 }>
          <Flex justifyContent="space-between" alignItems="center" textStyle="sm">
            <Text color="text.secondary">{ config.chain.currency.symbol } price</Text>
            <Skeleton loading={ isStatsLoading } fontWeight="medium">
              { hasCoinPrice ? usdFormatter.format(coinPriceValue) : '—' }
            </Skeleton>
          </Flex>
          <Box>
            <Skeleton loading={ coinPrice.isPending }>
              <MiniLineChart values={ coinPriceValues } h="72px"/>
            </Skeleton>
          </Box>
        </Card>
      ) : (
        <Card rowGap={ 3 } alignContent="start">
          <InfoRow
            label="Transactions today"
            value={ stats?.transactions_today ? decimalFormatter.format(Number(stats.transactions_today)) : '—' }
            isLoading={ false }
          />
          <InfoRow
            label="Gas used today"
            value={ stats?.gas_used_today ? compactFormatter.format(Number(stats.gas_used_today)) : '—' }
            isLoading={ false }
          />
          <InfoRow
            label="Total addresses"
            value={ stats?.total_addresses ? decimalFormatter.format(Number(stats.total_addresses)) : '—' }
            isLoading={ false }
          />
        </Card>
      ) }
    </Grid>
  );
};

export default React.memo(NetworkMetrics);
