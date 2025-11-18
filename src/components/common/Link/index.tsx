import type { JSX } from "preact/jsx-runtime";
import { scrollToTop } from "@/helpers/scrollToTop";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { ComponentChildren } from "preact";

type LinkProps = JSX.IntrinsicElements["a"] & {
  scrollToTop?: boolean;
  children?: ComponentChildren;
};

export const Link = ({
  scrollToTop: shouldScrollToTop,
  onClick,
  ...props
}: LinkProps) => {
  const { modifyHref } = useAffiliateNavigation();

  const handleClick = (e: JSX.TargetedMouseEvent<HTMLAnchorElement>) => {
    if (shouldScrollToTop) {
      scrollToTop();
    }
    onClick?.(e);
  };

  return (
    <a
      {...props}
      onClick={handleClick}
      href={modifyHref((props.href as string) || "")}
    />
  );
};
