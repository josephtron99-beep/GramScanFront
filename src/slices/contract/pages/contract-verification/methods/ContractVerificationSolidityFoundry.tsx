// SPDX-License-Identifier: LicenseRef-Blockscout
// Modified for Gramchain on 2026-10-12: user-facing Blockscout naming replaced with Gramchain.

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import config from 'src/config';

import { Link } from 'src/toolkit/chakra/link';

import ContractVerificationFormCodeSnippet from '../ContractVerificationFormCodeSnippet';
import ContractVerificationFormRow from '../ContractVerificationFormRow';
import ContractVerificationMethod from '../ContractVerificationMethod';
import { getFoundryVerificationParams } from './utils';

const ContractVerificationSolidityFoundry = () => {
  const { watch } = useFormContext<FormFields>();
  const address = watch('address');

  const { rpcUrl, apiKey, verifierUrl } = getFoundryVerificationParams();

  const codeSnippet = [
    'forge verify-contract \\',
    `  --rpc-url ${ rpcUrl } \\`,
    '  --verifier blockscout \\',
    `  --verifier-url '${ verifierUrl }' \\`,
    ...(apiKey ? [ `  --etherscan-api-key ${ apiKey } \\` ] : []),
    `  ${ address || '<address>' } \\`,
    '  [contractFile]:[contractName]',
  ].join('\n');

  return (
    <ContractVerificationMethod title="Contract verification via Foundry">
      <ContractVerificationFormRow>
        <Flex flexDir="column">
          <ContractVerificationFormCodeSnippet code={ codeSnippet }/>
        </Flex>
        <Box whiteSpace="pre-wrap">
          { config.chain.isProApiSupported && (
            <Box mt={ 1 }>
              <span>Get your Pro API key in the </span>
              <Link href="https://dev.blockscout.com/?utm_source=blockscout&utm_medium=contract_verification" external>
                Gram Chain Dev Portal
              </Link>
            </Box>
          ) }
        </Box>
      </ContractVerificationFormRow>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationSolidityFoundry);
