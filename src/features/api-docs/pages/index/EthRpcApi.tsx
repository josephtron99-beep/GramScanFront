// SPDX-License-Identifier: LicenseRef-Blockscout
// Modified for Gramchain on 2026-10-12: user-facing Blockscout naming replaced with Gramchain.

import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import { Link } from 'src/toolkit/chakra/link';

const EthRpcApi = () => {
  return (
    <Box>
      <Text>
        In addition to the custom RPC endpoints documented here,
        the Gram Chain ETH RPC API supports 3 methods in the exact format specified for Ethereum nodes,
        ee the Ethereum JSON-RPC Specification for more details.
      </Text>
      <Link href="https://docs.blockscout.com/devs/apis/rpc/eth-rpc" external mt={ 6 }>View examples</Link>
    </Box>
  );
};

export default React.memo(EthRpcApi);
