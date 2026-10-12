// SPDX-License-Identifier: LicenseRef-Blockscout
// Modified for Gramchain on 2026-10-12: new file, compact line and bar charts for the metrics panel.

import type { BoxProps } from '@chakra-ui/react';
import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

const VIEWBOX_WIDTH = 300;
const VIEWBOX_HEIGHT = 80;
const STROKE_WIDTH = 2;

interface Props extends BoxProps {
  readonly values: ReadonlyArray<number>;
}

const scale = (values: ReadonlyArray<number>) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return (value: number) => VIEWBOX_HEIGHT - STROKE_WIDTH - ((value - min) / range) * (VIEWBOX_HEIGHT - STROKE_WIDTH * 2);
};

export const MiniLineChart = ({ values, ...rest }: Props) => {
  const points = React.useMemo(() => {
    if (values.length < 2) {
      return '';
    }
    const y = scale(values);
    const step = VIEWBOX_WIDTH / (values.length - 1);
    return values.map((value, index) => `${ (index * step).toFixed(2) },${ y(value).toFixed(2) }`).join(' ');
  }, [ values ]);

  return (
    <Box color={{ base: 'brand.500', _dark: 'brand.50' }} h="80px" w="100%" { ...rest }>
      <chakra.svg viewBox={ `0 0 ${ VIEWBOX_WIDTH } ${ VIEWBOX_HEIGHT }` } preserveAspectRatio="none" w="100%" h="100%" overflow="visible">
        <line
          x1={ 0 }
          x2={ VIEWBOX_WIDTH }
          y1={ VIEWBOX_HEIGHT / 2 }
          y2={ VIEWBOX_HEIGHT / 2 }
          stroke="currentColor"
          strokeOpacity={ 0.25 }
          strokeDasharray="3 4"
          vectorEffect="non-scaling-stroke"
        />
        { points && (
          <polyline
            points={ points }
            fill="none"
            stroke="currentColor"
            strokeWidth={ STROKE_WIDTH }
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ) }
      </chakra.svg>
    </Box>
  );
};

const BAR_GAP_RATIO = 0.35;
const MIN_BAR_HEIGHT = 4;

export const MiniBarChart = ({ values, ...rest }: Props) => {
  const bars = React.useMemo(() => {
    if (values.length === 0) {
      return [];
    }
    const max = Math.max(...values) || 1;
    const slot = VIEWBOX_WIDTH / values.length;
    const width = slot * (1 - BAR_GAP_RATIO);
    return values.map((value, index) => {
      const height = Math.max(MIN_BAR_HEIGHT, (value / max) * VIEWBOX_HEIGHT);
      return { x: index * slot + (slot - width) / 2, y: VIEWBOX_HEIGHT - height, width, height };
    });
  }, [ values ]);

  return (
    <Box color={{ base: 'brand.500', _dark: 'brand.50' }} h="80px" w="100%" { ...rest }>
      <chakra.svg viewBox={ `0 0 ${ VIEWBOX_WIDTH } ${ VIEWBOX_HEIGHT }` } preserveAspectRatio="none" w="100%" h="100%">
        { bars.map((bar, index) => (
          <rect key={ index } x={ bar.x } y={ bar.y } width={ bar.width } height={ bar.height } fill="currentColor"/>
        )) }
      </chakra.svg>
    </Box>
  );
};
