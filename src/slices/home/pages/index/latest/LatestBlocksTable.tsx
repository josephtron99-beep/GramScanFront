// SPDX-License-Identifier: LicenseRef-Blockscout
// Modified for Gramchain on 2026-10-12: new file, "Latest Blocks" table of the home page.

import { Text } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import { useHomeDataContext } from 'src/slices/home/contexts/home-data-context';

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

import HashWithCopy from './HashWithCopy';
import HomeListCard from './HomeListCard';

const TABLE_MIN_WIDTH = '420px';

const getBlockStatus = (type: schemas['Block']['type']): { text: string; colorPalette: BadgeProps['colorPalette'] } => {
  switch (type) {
    case 'reorg':
      return { text: 'Reorg', colorPalette: 'gray' };
    case 'uncle':
      return { text: 'Uncle', colorPalette: 'gray' };
    default:
      return { text: 'Validated', colorPalette: 'gray' };
  }
};

const LatestBlocksTable = () => {
  const { blocksQuery } = useHomeDataContext();
  const isLoading = Boolean(blocksQuery?.isPlaceholderData);

  const content = (() => {
    if (blocksQuery?.isError) {
      return <Text textStyle="sm" color="text.secondary">Latest blocks are temporarily unavailable.</Text>;
    }
    if (!blocksQuery?.data?.length) {
      return <Text textStyle="sm" color="text.secondary">No latest blocks found.</Text>;
    }

    return (
      <TableContainerScrollable>
        <TableRoot minW={ TABLE_MIN_WIDTH }>
          <TableHeader>
            <TableRow>
              <TableColumnHeader>Status</TableColumnHeader>
              <TableColumnHeader>Number</TableColumnHeader>
              <TableColumnHeader>Hash</TableColumnHeader>
              <TableColumnHeader textAlign="right">Age</TableColumnHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            { blocksQuery.data.map((block, index) => {
              const status = getBlockStatus(block.type);
              return (
                <TableRow key={ block.height + (isLoading ? String(index) : '') }>
                  <TableCell verticalAlign="middle">
                    <Badge colorPalette={ status.colorPalette } loading={ isLoading }>{ status.text }</Badge>
                  </TableCell>
                  <TableCell verticalAlign="middle">
                    <BlockEntity number={ block.height } isLoading={ isLoading } noIcon fontWeight="medium"/>
                  </TableCell>
                  <TableCell verticalAlign="middle">
                    <HashWithCopy
                      hash={ block.hash }
                      href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(block.height) } }) }
                      isLoading={ isLoading }
                    />
                  </TableCell>
                  <TableCell verticalAlign="middle" textAlign="right" whiteSpace="nowrap">
                    <TimeWithTooltip
                      timestamp={ block.timestamp }
                      enableIncrement={ !isLoading }
                      timeFormat="relative"
                      isLoading={ isLoading }
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
    <HomeListCard title="Latest Blocks" viewAllHref={ route({ pathname: '/blocks' }) }>
      { content }
    </HomeListCard>
  );
};

export default LatestBlocksTable;
