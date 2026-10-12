// SPDX-License-Identifier: LicenseRef-Blockscout
// Modified for Gramchain on 2026-10-12: new file, card shell for the home page latest-items tables.

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import { Button } from 'src/toolkit/chakra/button';
import { Heading } from 'src/toolkit/chakra/heading';
import { Link } from 'src/toolkit/chakra/link';

type Props = {
  readonly title: string;
  readonly viewAllHref: string;
  readonly children: React.ReactNode;
};

const HomeListCard = ({ title, viewAllHref, children }: Props) => (
  <Box
    borderWidth="1px"
    borderColor="border.divider"
    borderRadius="lg"
    bgColor={{ _light: 'gray.50', _dark: 'whiteAlpha.50' }}
    p={{ base: 4, lg: 5 }}
    minW={ 0 }
  >
    <Flex justifyContent="space-between" alignItems="center" mb={ 4 } columnGap={ 3 }>
      <Heading level="3">{ title }</Heading>
      <Link href={ viewAllHref } asChild>
        <Button size="sm" variant="subtle">View All</Button>
      </Link>
    </Flex>
    { children }
  </Box>
);

export default HomeListCard;
