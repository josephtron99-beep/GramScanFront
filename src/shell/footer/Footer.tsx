// SPDX-License-Identifier: LicenseRef-Blockscout
// Modified for Gramchain on 2026-10-12: Gramchain footer with one-line minimal attribution and icon-only social links.

import { Box, Flex, Grid, HStack, Text } from '@chakra-ui/react';
import React from 'react';

import { useAppContext } from 'src/shell/app/context';
import { CONTENT_MAX_WIDTH } from 'src/shell/layout/utils';

import IndexingStatusInternalTxs from 'src/slices/chain/indexing-status/IndexingStatusInternalTxs';
import NetworkLogo from 'src/slices/chain/logo/NetworkLogo';

import NetworkAddToWallet from 'src/features/web3-wallet/components/NetworkAddToWallet';

import config from 'src/config';
import { BLOCKSCOUT_ATTRIBUTION_URL, GRAMCHAIN_SOCIAL_LINKS } from 'src/shared/links/external-links-policy';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';
import type { IconName } from 'src/sprite/SpriteIcon';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';
import { copy } from 'src/toolkit/utils/htmlEntities';

import FooterCookieSettings from './FooterCookieSettings';

const SOCIAL_ICONS: Record<typeof GRAMCHAIN_SOCIAL_LINKS[number]['id'], IconName> = {
  x: 'social/twitter_filled',
  medium: 'social/medium_filled',
  telegram: 'social/telegram_filled',
};

const Footer = () => {
  const { onionDomain } = useAppContext();

  const currentYear = (new Date()).getFullYear();

  return (
    <Box as="footer" borderTopWidth="1px" borderTopColor="border.divider" bgColor={{ _dark: 'blackAlpha.400' }}>
      <Grid
        px={{ base: 4, lg: config.shell.navigation.layout === 'horizontal' ? 6 : 12, '2xl': 6 }}
        py={{ base: 6, lg: 10 }}
        gridTemplateColumns={{ base: '1fr', lg: 'minmax(auto, 520px) 1fr' }}
        columnGap={{ lg: 8, xl: 24 }}
        rowGap={ 8 }
        maxW={ `${ CONTENT_MAX_WIDTH }px` }
        m="0 auto"
      >
        <Box>
          <NetworkLogo/>
          <Text mt={ 4 } textStyle="sm" color="text.secondary">
            Gram Chain Explorer lets you search, inspect, and analyze blocks, transactions, addresses, tokens, and smart contracts.
          </Text>
          <Flex mt={ 5 } columnGap={ 3 } rowGap={ 2 } flexWrap="wrap" alignItems="center" _empty={{ display: 'none' }}>
            { !config.chain.indexingStatus.intTxs.isHidden && <IndexingStatusInternalTxs/> }
            { !config.features.multichain.isEnabled && <NetworkAddToWallet source="Footer"/> }
          </Flex>
        </Box>

        <Flex alignItems="flex-start" justifyContent={{ base: 'flex-start', lg: 'flex-end' }}>
          <HStack gap={ 3 }>
            { GRAMCHAIN_SOCIAL_LINKS.map((link) => (
              <Link
                key={ link.id }
                href={ link.url }
                external
                noIcon
                aria-label={ `Gram Chain on ${ link.text }` }
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                boxSize={ 10 }
                borderRadius="base"
                borderWidth="1px"
                borderColor="border.divider"
                color="text.secondary"
                _hover={{ color: 'link.primary', borderColor: 'link.primary' }}
              >
                <SpriteIcon name={ SOCIAL_ICONS[link.id] } boxSize={ 5 }/>
              </Link>
            )) }
          </HStack>
        </Flex>

        <Flex
          gridColumn={{ lg: '1 / -1' }}
          pt={ 5 }
          borderTopWidth="1px"
          borderTopColor="border.divider"
          alignItems="center"
          flexWrap="wrap"
          columnGap={ 2 }
          rowGap={ 1 }
          textStyle="xs"
          color="text.secondary"
        >
          <span>{ copy } { currentYear } Gram Chain</span>
          <span>·</span>
          <span>Explorer software { copy } Blockscout Limited</span>
          <span>·</span>
          <span>Made with</span>
          <Link
            href={ BLOCKSCOUT_ATTRIBUTION_URL }
            external
            noIcon
            display="inline-flex"
            color={{ base: 'blue.600', _dark: 'white' }}
            _hover={{ color: { base: 'blue.600', _dark: 'white' } }}
            aria-label="Blockscout"
          >
            <SpriteIcon name="networks/logo-placeholder" width="64px" height={ 3 }/>
          </Link>
          { onionDomain && (
            <HStack columnGap={ 0 }>
              <span>·</span>
              <Text aria-label={ `Also accessible via Tor Browser: ${ onionDomain }` } ml={ 2 }>Tor</Text>
              <CopyToClipboard text={ onionDomain } tooltipContent="Copy .onion address to clipboard" ml={ 1 }/>
            </HStack>
          ) }
          { config.services.usercentrics && <FooterCookieSettings ml="auto"/> }
        </Flex>
      </Grid>
    </Box>
  );
};

export default React.memo(Footer);
