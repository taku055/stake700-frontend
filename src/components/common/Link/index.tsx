import type { JSX } from "react";
import { scrollToTop } from "@/helpers/scrollToTop";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import type { ReactNode as ComponentChildren } from "react";

type LinkProps = JSX.IntrinsicElements["a"] & {
  scrollToTop?: boolean;
  children?: ComponentChildren;
  preventDefaultOnClick?: boolean;
  stopPropagationOnClick?: boolean;
};

export const Link = ({
  scrollToTop: shouldScrollToTop,
  onClick,
  preventDefaultOnClick = true,
  stopPropagationOnClick = true,
  ...props
}: LinkProps) => {
  const { modifyHref } = useAffiliateNavigation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick && typeof onClick === "function") {
      if (preventDefaultOnClick) {
        e.preventDefault();
      }
      if (stopPropagationOnClick) {
        e.stopPropagation();
      }
      onClick?.(e);
    }
    
    if (shouldScrollToTop) {
      scrollToTop();
    }
  };

  return (
    <a
      {...props}
      onClick={handleClick}
      href={modifyHref((props.href as string) || "")}
    />
  );
};
