// SPDX-License-Identifier: LicenseRef-Blockscout
// Modified for Gramchain on 2026-10-12: charts are watermarked with the network (Gram Chain) logo.

import type { IconProps } from '@chakra-ui/react';
import { chakra, Icon } from '@chakra-ui/react';
import React from 'react';

import config from 'src/config';
import LogoIcon from 'src/sprite/icons/networks/logo-placeholder.svg';

import { useColorModeValue } from '../../../chakra/color-mode';

export const ChartWatermark = React.memo((props: IconProps) => {
  const logoSrc = useColorModeValue(config.chain.logo.default, config.chain.logo.dark || config.chain.logo.default);

  if (logoSrc) {
    return (
      <chakra.img
        src={ logoSrc }
        alt=""
        aria-hidden
        position="absolute"
        opacity={ 0.12 }
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        pointerEvents="none"
        objectFit="contain"
        maxW="40%"
        { ...props as React.ComponentProps<typeof chakra.img> }
      />
    );
  }

  return (
    <Icon
      position="absolute"
      opacity={ 0.1 }
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      pointerEvents="none"
      viewBox="0 0 114 20"
      color={{ _light: 'link.primary', _dark: 'white' }}
      { ...props }
    >
      <LogoIcon/>
    </Icon>
  );
});
