// SPDX-License-Identifier: LicenseRef-Blockscout
// Modified for Gramchain on 2026-10-12: user-facing Blockscout naming replaced with Gramchain.

import type { DeFiDropdownButtonText, DeFiDropdownItem } from 'src/features/defi-dropdown/types/client';

import app from 'src/config/app';
import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const items = parseEnvJson<Array<DeFiDropdownItem>>(getEnvValue('NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS')) || [];
const buttonTextEnv = parseEnvJson<DeFiDropdownButtonText>(getEnvValue('NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT'));

const DEFAULT_BUTTON_TEXT = { desktop: 'Gram Chain DeFi', mobile: 'DeFi' };

const buttonText = buttonTextEnv ?
  { desktop: buttonTextEnv.desktop, mobile: buttonTextEnv.mobile || buttonTextEnv.desktop } :
  DEFAULT_BUTTON_TEXT;

const title = 'DeFi dropdown';

type Payload = {
  items: Array<DeFiDropdownItem>;
  buttonText: Required<DeFiDropdownButtonText>;
};

const config: Feature<Payload> = (() => {
  if (!app.isPrivateMode && items.length > 0) {
    return Object.freeze({
      title,
      isEnabled: true,
      items,
      buttonText,
    });
  }
  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
