// SPDX-License-Identifier: LicenseRef-Blockscout
// Modified for Gramchain on 2026-10-12: new file, outbound link allowlist.

import config from 'src/config';

export const GRAMCHAIN_SOCIAL_LINKS = [
  { id: 'x', text: 'X', url: 'https://x.com/Gram_Network' },
  { id: 'medium', text: 'Medium', url: 'https://medium.com/@Gramchain_network' },
  { id: 'telegram', text: 'Telegram', url: 'https://t.me/GramchainNetwork' },
] as const;

// The Blockscout licence (§2c) requires the footer attribution to link to blockscout.com.
export const BLOCKSCOUT_ATTRIBUTION_URL = 'https://blockscout.com';

const ALLOWED_EXTERNAL_URLS: ReadonlyArray<string> = [
  BLOCKSCOUT_ATTRIBUTION_URL,
  ...GRAMCHAIN_SOCIAL_LINKS.map(({ url }) => url),
];

const normalize = (url: URL): string => `${ url.origin }${ url.pathname.replace(/\/$/, '') }`.toLowerCase();

const ALLOWED_NORMALIZED = new Set(ALLOWED_EXTERNAL_URLS.map((url) => normalize(new URL(url))));

const APP_ORIGIN = (() => {
  try {
    return new URL(config.app.baseUrl).origin;
  } catch {
    return 'http://localhost';
  }
})();

export function isExternalHref(href: string): boolean {
  try {
    const url = new URL(href, APP_ORIGIN);
    return [ 'http:', 'https:' ].includes(url.protocol) && url.origin !== APP_ORIGIN;
  } catch {
    return false;
  }
}

export function isAllowedExternalHref(href: string): boolean {
  try {
    return ALLOWED_NORMALIZED.has(normalize(new URL(href)));
  } catch {
    return false;
  }
}

export function isBlockedExternalHref(href: unknown): boolean {
  if (typeof href !== 'string') {
    return false;
  }
  return isExternalHref(href) && !isAllowedExternalHref(href);
}
