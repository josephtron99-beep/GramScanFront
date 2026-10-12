// SPDX-License-Identifier: LicenseRef-Blockscout
// Modified for Gramchain on 2026-10-12: new file, page-wide guard for outbound navigation.

import React from 'react';

import { isBlockedExternalHref } from './external-links-policy';

// Catches anchors the Link component never sees: raw <a> tags, buttons rendered as anchors,
// and HTML strings injected from API or config data.
export default function useBlockExternalNavigation(): void {
  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (anchor && isBlockedExternalHref(anchor.getAttribute('href'))) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const originalOpen = window.open;
    window.open = (url?: string | URL, ...rest) => {
      if (url !== undefined && isBlockedExternalHref(url.toString())) {
        return null;
      }
      return originalOpen.call(window, url, ...rest);
    };

    document.addEventListener('click', handleClick, true);
    document.addEventListener('auxclick', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('auxclick', handleClick, true);
      window.open = originalOpen;
    };
  }, []);
}
