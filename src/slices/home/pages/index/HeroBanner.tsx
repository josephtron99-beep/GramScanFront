// SPDX-License-Identifier: LicenseRef-Blockscout
// Modified for Gramchain on 2026-10-12: centered hero with monochrome streak background (light and dark) and stat chips.

// we use custom heading size for hero banner
// eslint-disable-next-line no-restricted-imports
import { Box, Flex, Heading } from '@chakra-ui/react';
import React from 'react';

import SearchBar from 'src/slices/search/components/search-bar/SearchBarDesktop';
import SearchBarMobile from 'src/slices/search/components/search-bar/SearchBarMobile';

import config from 'src/config';

import HeroStatChips from './hero/HeroStatChips';

// Decorative artwork, not UI colours: faint radial streaks on a white (light) or near-black (dark) base,
// the monochrome take on the Gram Chain reference design. No token equivalent exists for these gradients.
export const BACKGROUND_DEFAULT = [
  'radial-gradient(ellipse 70% 60% at 50% 115%, rgba(0, 0, 0, 0.06) 0%, rgba(0, 0, 0, 0) 70%)',
  'radial-gradient(circle at 50% 120%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 75%)',
  'repeating-conic-gradient(from 0deg at 50% 120%, rgba(0, 0, 0, 0.07) 0deg 0.35deg, rgba(0, 0, 0, 0) 0.35deg 2.4deg)',
  'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
].join(', ');

const BACKGROUND_DARK = [
  'radial-gradient(ellipse 70% 60% at 50% 115%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
  'radial-gradient(circle at 50% 120%, rgba(10, 10, 11, 0) 0%, rgba(10, 10, 11, 0.85) 75%)',
  'repeating-conic-gradient(from 0deg at 50% 120%, rgba(255, 255, 255, 0.07) 0deg 0.35deg, rgba(0, 0, 0, 0) 0.35deg 2.4deg)',
  'linear-gradient(180deg, #141518 0%, #0A0A0B 100%)',
].join(', ');

const HeroBanner = () => {
  const text = config.slices.home.heroBanner?.text || `${ config.chain.name } Block Explorer`;

  return (
    <Box
      w="100%"
      background={{ base: BACKGROUND_DEFAULT, _dark: BACKGROUND_DARK }}
      borderWidth="1px"
      borderColor="border.divider"
      borderRadius="lg"
      px={{ base: 4, lg: 10 }}
      pt={{ base: 8, lg: 14 }}
      pb={{ base: 6, lg: 10 }}
      overflow="hidden"
    >
      <Flex direction="column" alignItems="center" maxW="1080px" mx="auto">
        <Heading
          as="h1"
          fontSize={{ base: '26px', lg: '44px' }}
          lineHeight={{ base: '32px', lg: '52px' }}
          fontWeight="bold"
          letterSpacing="-0.02em"
          color={{ base: 'brand.500', _dark: 'white' }}
          textAlign="center"
          mb={{ base: 5, lg: 7 }}
        >
          { text }
        </Heading>
        <Box w="100%" display={{ base: 'flex', lg: 'none' }}>
          <SearchBarMobile isHeroBanner/>
        </Box>
        <Box w="100%" maxW="860px" display={{ base: 'none', lg: 'flex' }}>
          <SearchBar isHeroBanner/>
        </Box>
        <HeroStatChips mt={ 4 }/>
      </Flex>
    </Box>
  );
};

export default React.memo(HeroBanner);
