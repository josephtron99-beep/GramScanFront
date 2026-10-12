// SPDX-License-Identifier: LicenseRef-Blockscout
// Modified for Gramchain on 2026-10-12: new file, "Latest Transactions" table of the home page.

import { Text } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useApiQuery from 'src/api/hooks/useApiQuery';

import TxType from 'src/slices/tx/components/TxType';
import { TX } from 'src/slices/tx/stubs/tx';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';

import type { BadgeProps } from 'src/toolkit/chakra/badge';
import { Badge } from 'src/toolkit/chakra/badge';
import {
  TableBody,
  TableCell,
  TableColumnHeader,
  TableContainerScrollable,
  TableHeader,
  TableRoot,
  TableRow,
} from 'src/toolkit/chakra/table';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

import HashWithCopy from './HashWithCopy';
import HomeListCard from './HomeListCard';

const TXS_COUNT = 5;
const TABLE_MIN_WIDTH = '420px';

const getTxStatus = (status: schemas['Transaction']['status']): { text: string; colorPalette: BadgeProps['colorPalette'] } => {
  switch (status) {
    case 'ok':
      return { text: 'Success', colorPalette: 'gray' };
    case 'error':
      return { text: 'Failed', colorPalette: 'red' };
    default:
      return { text: 'Pending', colorPalette: 'gray' };
  }
};

const LatestTxsTable = () => {
  const { data, isPlaceholderData, isError } = useApiQuery('core:homepage_txs', {
    queryOptions: {
      placeholderData: Array(TXS_COUNT).fill(TX),
    },
  });

  const content = (() => {
    if (isError) {
      return <Text textStyle="sm" color="text.secondary">Latest transactions are temporarily unavailable.</Text>;
    }
    if (!data?.length) {
      return <Text textStyle="sm" color="text.secondary">No latest transactions found.</Text>;
    }

    return (
      <TableContainerScrollable>
        <TableRoot minW={ TABLE_MIN_WIDTH }>
          <TableHeader>
            <TableRow>
              <TableColumnHeader>Status</TableColumnHeader>
              <TableColumnHeader>Hash</TableColumnHeader>
              <TableColumnHeader>Type</TableColumnHeader>
              <TableColumnHeader textAlign="right">Age</TableColumnHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            { data.slice(0, TXS_COUNT).map((tx, index) => {
              const status = getTxStatus(tx.status);
              return (
                <TableRow key={ tx.hash + (isPlaceholderData ? String(index) : '') }>
                  <TableCell verticalAlign="middle">
                    <Tooltip content={ tx.status === 'error' ? tx.result : undefined } disabled={ tx.status !== 'error' }>
                      <Badge colorPalette={ status.colorPalette } loading={ isPlaceholderData }>{ status.text }</Badge>
                    </Tooltip>
                  </TableCell>
                  <TableCell verticalAlign="middle">
                    <HashWithCopy
                      hash={ tx.hash }
                      href={ route({ pathname: '/tx/[hash]', query: { hash: tx.hash } }) }
                      isLoading={ isPlaceholderData }
                    />
                  </TableCell>
                  <TableCell verticalAlign="middle">
                    <TxType types={ tx.transaction_types } isLoading={ isPlaceholderData } colorPalette="gray"/>
                  </TableCell>
                  <TableCell verticalAlign="middle" textAlign="right" whiteSpace="nowrap">
                    <TimeWithTooltip
                      timestamp={ tx.timestamp }
                      enableIncrement={ !isPlaceholderData }
                      timeFormat="relative"
                      isLoading={ isPlaceholderData }
                      color="text.secondary"
                      whiteSpace="nowrap"
                    />
                  </TableCell>
                </TableRow>
              );
            }) }
          </TableBody>
        </TableRoot>
      </TableContainerScrollable>
    );
  })();

  return (
    <HomeListCard title="Latest Transactions" viewAllHref={ route({ pathname: '/txs' }) }>
      { content }
    </HomeListCard>
  );
};

export default LatestTxsTable;
