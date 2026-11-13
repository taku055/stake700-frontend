"use client";

import NextLink from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { scrollToTop } from "@/helpers/scrollToTop";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { useLocale } from "@/router";
import { localizeHref } from "@/config/i18n";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href?: string;
  scrollToTop?: boolean;
  children?: ReactNode;
  /** Only applies when an onClick handler is passed (legacy behaviour). */
  preventDefaultOnClick?: boolean;
  stopPropagationOnClick?: boolean;
  /** next/link prefetching; defaults to Next's viewport-based behaviour. */
  prefetch?: boolean | null;
  replace?: boolean;
};

function isInternal(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

/**
 * App-wide link. Internal hrefs are rendered with next/link (client-side
 * navigation + prefetch) and automatically prefixed with the active locale;
 * external, mailto:, tel: and #hash links render a plain <a>.
 */
export const Link = ({
  scrollToTop: shouldScrollToTop,
  onClick,
  preventDefaultOnClick = true,
  stopPropagationOnClick = true,
  href = "",
  prefetch,
  replace,
  ...props
}: LinkProps) => {
  const { modifyHref } = useAffiliateNavigation();
  const locale = useLocale();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick && typeof onClick === "function") {
      if (preventDefaultOnClick) e.preventDefault();
      if (stopPropagationOnClick) e.stopPropagation();
      onClick(e);
    }
    if (shouldScrollToTop && !e.defaultPrevented) scrollToTop();
  };

  if (!href || !isInternal(href)) {
    return <a {...props} href={href || undefined} onClick={handleClick} />;
  }

  return (
    <NextLink
      {...props}
      href={localizeHref(modifyHref(href), locale)}
      prefetch={prefetch}
      replace={replace}
      scroll={shouldScrollToTop ?? true}
      onClick={handleClick}
    />
  );
};
