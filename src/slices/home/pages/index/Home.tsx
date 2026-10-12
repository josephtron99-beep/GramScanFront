// SPDX-License-Identifier: LicenseRef-Blockscout
// Modified for Gramchain on 2026-10-12: hero, network metrics and latest blocks/transactions tables layout.

import { Box, Grid } from '@chakra-ui/react';
import React from 'react';

import { HomeDataContextProvider } from 'src/slices/home/contexts/home-data-context';
import { HomeRpcDataContextProvider } from 'src/slices/home/contexts/rpc-data-context';

import LatestArbitrumL2Batches from 'src/features/rollup/arbitrum/pages/home/LatestArbitrumL2Batches';

import config from 'src/config';

import HeroBanner from './HeroBanner';
import LatestBlocksTable from './latest/LatestBlocksTable';
import LatestTxsTable from './latest/LatestTxsTable';
import NetworkMetrics from './metrics/NetworkMetrics';

const rollupFeature = config.features.rollup;

const Home = () => {
  const leftWidget = (() => {
    if (rollupFeature.isEnabled && !rollupFeature.homepage.showLatestBlocks) {
      switch (rollupFeature.type) {
        case 'arbitrum':
          return <LatestArbitrumL2Batches/>;
      }
    }

    return <LatestBlocksTable/>;
  })();

  return (
    <HomeDataContextProvider>
      <HomeRpcDataContextProvider>
        <Box as="main">
          <HeroBanner/>
          <NetworkMetrics mt={ 6 }/>
          <Grid mt={ 6 } gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }} gap={ 3 }>
            { leftWidget }
            <LatestTxsTable/>
          </Grid>
        </Box>
      </HomeRpcDataContextProvider>
    </HomeDataContextProvider>
  );
};

export default Home;
