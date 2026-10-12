// SPDX-License-Identifier: LicenseRef-Blockscout
// Modified for Gramchain on 2026-10-12: new file, short linked hash with copy button.

import React from 'react';

import * as EntityBase from 'src/shared/entities/components';

type Props = {
  readonly hash: string;
  readonly href: string;
  readonly isLoading: boolean;
};

const HashWithCopy = ({ hash, href, isLoading }: Props) => (
  <EntityBase.Container minW="max-content">
    <EntityBase.Link href={ href } isLoading={ isLoading }>
      <EntityBase.Content text={ hash } truncation="constant" isLoading={ isLoading }/>
    </EntityBase.Link>
    <EntityBase.Copy text={ hash } isLoading={ isLoading }/>
  </EntityBase.Container>
);

export default React.memo(HashWithCopy);
