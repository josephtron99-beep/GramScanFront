// SPDX-License-Identifier: LicenseRef-Blockscout
// Modified for Gramchain on 2026-10-12: links to non-allowlisted external sites render as plain text.

import type { LinkProps as ChakraLinkProps, IconProps } from '@chakra-ui/react';
import { Link as ChakraLink, LinkBox as ChakraLinkBox, LinkOverlay as ChakraLinkOverlay, Icon } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';

import { isBlockedExternalHref } from 'src/shared/links/external-links-policy';
import stripUtmParams from 'src/shared/links/strip-utm-params';
import ArrowIcon from 'src/sprite/icons/link_external.svg';

import { Skeleton } from './skeleton';

export const LinkExternalIcon = ({ color, ...rest }: IconProps) => (
  <Icon
    boxSize={ 3 }
    verticalAlign="middle"
    color={ color ?? 'icon.secondary' }
    _groupHover={{
      color: 'inherit',
    }}
    flexShrink={ 0 }
    { ...rest }
  >
    <ArrowIcon/>
  </Icon>
);

interface LinkPropsChakra extends ChakraLinkProps {
  loading?: boolean;
  external?: boolean;
  iconColor?: ChakraLinkProps['color'];
  noIcon?: boolean;
  disabled?: boolean;
}

interface LinkPropsNext extends Partial<Pick<NextLinkProps, 'shallow' | 'prefetch' | 'scroll'>> {}

export interface LinkProps extends LinkPropsChakra, LinkPropsNext {}

const splitProps = (props: LinkProps): { chakra: LinkPropsChakra; next: NextLinkProps } => {
  const { scroll = true, shallow = false, prefetch = false, ...rest } = props;

  return {
    chakra: rest,
    next: {
      href: rest.href as NextLinkProps['href'],
      scroll,
      shallow,
      prefetch,
    },
  };
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(props, ref) {
    const { chakra, next } = splitProps(props);
    const { external, loading, href, children, disabled, noIcon, iconColor, className, ...rest } = chakra;

    if (isBlockedExternalHref(href)) {
      return (
        <Skeleton loading={ loading } ref={ ref as React.ForwardedRef<HTMLDivElement> } asChild>
          <ChakraLink
            asChild
            className={ className }
            { ...rest }
            color="inherit"
            cursor="inherit"
            _hover={{ color: 'inherit', textDecoration: 'none' }}
          >
            <span>{ children }</span>
          </ChakraLink>
        </Skeleton>
      );
    }

    if (external) {
      // Strip UTM parameters from external links if in private mode
      const processedHref = typeof href === 'string' ? stripUtmParams(href) : href;

      return (
        <Skeleton loading={ loading } ref={ ref as React.ForwardedRef<HTMLDivElement> } asChild>
          <ChakraLink
            href={ processedHref }
            className={ className ? `group ${ className }` : 'group' }
            target="_blank"
            rel="noopener noreferrer"
            { ...(disabled ? { 'data-disabled': true } : {}) }
            { ...rest }
          >
            { children }
            { !noIcon && <LinkExternalIcon color={ iconColor }/> }
          </ChakraLink>
        </Skeleton>
      );
    }

    return (
      <Skeleton loading={ loading } ref={ ref as React.ForwardedRef<HTMLDivElement> } asChild>
        <ChakraLink
          asChild
          className={ className }
          { ...(disabled ? { 'data-disabled': true } : {}) }
          { ...rest }
        >
          { next.href ? (
            <NextLink { ...next }>
              { children }
            </NextLink>
          ) :
            <span>{ children }</span>
          }
        </ChakraLink>
      </Skeleton>
    );
  },
);

export const LinkBox = ChakraLinkBox;

export const LinkOverlay = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function LinkOverlay(props, ref) {
    const { chakra, next } = splitProps(props);
    const { children, external, loading, href, noIcon, iconColor, ...rest } = chakra;

    if (isBlockedExternalHref(href)) {
      return (
        <ChakraLinkOverlay ref={ ref } { ...rest }>
          { children ? (
            <Skeleton display="inline-flex" alignItems="center" loading={ loading } maxW="100%" h="100%">
              { children }
            </Skeleton>
          ) : null }
        </ChakraLinkOverlay>
      );
    }

    if (external) {
      // Strip UTM parameters from external links if in private mode
      const processedHref = typeof href === 'string' ? stripUtmParams(href) : href;

      return (
        <ChakraLinkOverlay
          ref={ ref }
          href={ loading ? undefined : processedHref }
          target="_blank"
          rel="noopener noreferrer"
          { ...rest }
        >
          { Boolean(children || (!noIcon && href)) && (
            <Skeleton display="inline-flex" alignItems="center" loading={ loading } maxW="100%" h="100%">
              { children }
              { !noIcon && href && <LinkExternalIcon color={ iconColor }/> }
            </Skeleton>
          ) }
        </ChakraLinkOverlay>
      );
    }

    const content = children ? (
      <Skeleton display="inline-flex" alignItems="center" loading={ loading } maxW="100%" h="100%">
        { children }
      </Skeleton>
    ) : null;

    return (
      <ChakraLinkOverlay
        ref={ ref }
        asChild={ Boolean(next.href) }
        { ...rest }
      >
        { next.href ? <NextLink { ...next }>{ content }</NextLink> : content }
      </ChakraLinkOverlay>
    );
  },
);
