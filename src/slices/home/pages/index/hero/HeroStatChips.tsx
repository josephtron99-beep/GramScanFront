// SPDX-License-Identifier: LicenseRef-Blockscout
// Modified for Gramchain on 2026-10-12: new file, hero stat chips.

import type { GridProps } from '@chakra-ui/react';
import { Grid, Text } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import useStatsQuery from 'src/slices/chain/stats/useStatsQuery';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

type StatChip = {
  readonly label: string;
  readonly value: string | null | undefined;
  readonly href: string;
  readonly isLoading: boolean;
};

const formatCount = (value: string | null | undefined): string => {
  const num = Number(value);
  return value && Number.isFinite(num) ? num.toLocaleString('en-US') : '—';
};

const HeroStatChips = (props: GridProps) => {
  const statsQuery = useStatsQuery();
  const contractsQuery = useApiQuery('core:verified_contracts_counters', {
    queryOptions: { refetchOnMount: false },
  });

  const chips = React.useMemo((): Array<StatChip> => [
    {
      label: 'Transactions',
      value: statsQuery.data?.total_transactions,
      href: route({ pathname: '/txs' }),
      isLoading: statsQuery.isPlaceholderData,
    },
    {
      label: 'Blocks',
      value: statsQuery.data?.total_blocks,
      href: route({ pathname: '/blocks' }),
      isLoading: statsQuery.isPlaceholderData,
    },
    {
      label: 'Addresses',
      value: statsQuery.data?.total_addresses,
      href: route({ pathname: '/accounts' }),
      isLoading: statsQuery.isPlaceholderData,
    },
    {
      label: 'Contracts',
      value: contractsQuery.data?.verified_smart_contracts,
      href: route({ pathname: '/verified-contracts' }),
      isLoading: contractsQuery.isPending,
    },
  ], [ statsQuery.data, statsQuery.isPlaceholderData, contractsQuery.data, contractsQuery.isPending ]);

  return (
    <Grid
      w="100%"
      gridTemplateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }}
      gap={ 2 }
      { ...props }
    >
      { chips.map((chip) => (
        <Link
          key={ chip.label }
          href={ chip.href }
          display="flex"
          alignItems="center"
          columnGap={ 2 }
          px={ 3 }
          py={ 2 }
          borderRadius="base"
          borderWidth="1px"
          borderColor="border.divider"
          bgColor={{ base: 'white', _dark: 'whiteAlpha.50' }}
          color="text.primary"
          textStyle="sm"
          _hover={{ color: 'hover', borderColor: 'hover', textDecoration: 'none' }}
        >
          <Text as="span" fontWeight="medium" flexShrink={ 0 }>{ chip.label }</Text>
          <Skeleton loading={ chip.isLoading } color="text.secondary" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            { formatCount(chip.value) }
          </Skeleton>
          <SpriteIcon name="link_external" boxSize={ 3 } ml="auto" flexShrink={ 0 } color="icon.primary"/>
        </Link>
      )) }
    </Grid>
  );
};

export default React.memo(HeroStatChips);
