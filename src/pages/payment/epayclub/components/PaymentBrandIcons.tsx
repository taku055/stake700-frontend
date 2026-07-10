import type { CardBrand } from "./cardBrand";

type IconProps = { className?: string };

export function VisaIcon({ className = "h-4 w-auto" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 16" fill="currentColor" aria-hidden>
      <path d="M19.5 1.2h-3.4l-2.1 13.6h3.4L19.5 1.2zm9.8 8.8c0-3.4-4.7-3.6-4.7-5.1 0-.5.5-.9 1.5-.9 1.3 0 2.3.3 3 .6l.5-2.4c-.7-.3-1.8-.6-3.2-.6-3.4 0-5.8 1.8-5.8 4.4 0 1.9 1.7 3 3 3.6 1.3.6 1.8 1 1.8 1.5 0 .8-1.1 1.2-2.1 1.2-1.8 0-2.8-.5-3.6-.9l-.6 2.5c.8.4 2.2.7 3.7.7 3.6 0 5.9-1.8 5.9-4.6zm11.2 4.8h3.1l-2.7-13.6h-2.8c-.6 0-1.1.4-1.3.9l-4.7 12.7h3.5l.7-1.9h4.3l.4 1.9zm-3.7-4.4 1.8-4.9.9 4.9h-2.7zM14.1 1.2 10.8 9.6 10.4 7.2c-.7-2.6-2.9-4.4-5.4-5.2L7.8 14.8h3.5l6.1-13.6H14.1z" />
    </svg>
  );
}

export function MastercardIcon({ className = "h-4 w-auto" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 20" fill="currentColor" aria-hidden>
      <circle cx="12" cy="10" r="7" opacity="0.85" />
      <circle cx="20" cy="10" r="7" opacity="0.55" />
    </svg>
  );
}

export function AmexIcon({ className = "h-4 w-auto" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 16" fill="currentColor" aria-hidden>
      <path d="M2 1.2h8.5l1.2 2.8L13 1.2h8.3v13.6H13l-1.3-2.9-1.3 2.9H2V1.2zm3.5 2.4L4.2 9.2h1.8l.6-2.2.6 2.2h1.8L7.1 3.6H5.5zm5.8 0v5.6h2.1V7.1h2.4v2.1h2.1V3.6h-6.6zm9.2 0 2.1 5.6V3.6h2v5.6l2.1-5.6h2.3l-3.2 7.6h-2.1l-3.2-7.6h2zm10.4 0v5.6h5.4v-1.8h-3.3V7.8h3.1V6h-3.1V5.4h3.3V3.6h-5.4z" />
    </svg>
  );
}

export function DiscoverIcon({ className = "h-4 w-auto" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 16" fill="currentColor" aria-hidden>
      <path d="M8.5 2.5C5.5 2.5 3 4.7 3 7.8s2.5 5.3 5.5 5.3c3.1 0 5.5-2.2 5.5-5.3S11.6 2.5 8.5 2.5zm24.5 0c-2.5 0-4.4 1.4-4.4 3.4 0 1.6 1.2 2.5 3.4 2.9l1 .2c1 .2 1.4.4 1.4.9 0 .5-.5.9-1.5.9-1.2 0-2.1-.4-2.8-1.1l-1.5 1.8c1 .9 2.4 1.4 4.2 1.4 2.6 0 4.5-1.5 4.5-3.6 0-1.7-1.2-2.6-3.4-3l-1-.2c-.9-.2-1.3-.4-1.3-.8 0-.5.5-.8 1.3-.8 1 0 1.8.3 2.4.9l1.4-1.7c-.8-.7-2-1.2-3.7-1.2zM2 2.8v10.4h3.8c3.2 0 5.5-2.1 5.5-5.2S9 2.8 5.8 2.8H2zm18.2 0v10.4h2.4V8.2l3.5 5h3.1l-3.7-5.4 3.4-4.6h-2.9l-2.8 3.9V2.8h-2.6zm12.4 0c-2.2 0-3.7 1.2-3.7 2.9 0 1.2.8 2 2.5 2.5l1.2.3c.8.2 1.1.4 1.1.7 0 .4-.4.7-1.2.7-.9 0-1.6-.3-2.1-.8l-1.2 1.5c.8.7 1.9 1.1 3.3 1.1 2.1 0 3.6-1.2 3.6-2.9 0-1.3-.9-2.1-2.6-2.5l-1.2-.3c-.7-.2-1-.3-1-.6 0-.4.4-.6 1-.6.8 0 1.4.2 1.9.7l1.1-1.4z" />
    </svg>
  );
}

export function ApplePayIcon({ className = "h-3.5 w-auto" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 16" fill="currentColor" aria-hidden>
      <path d="M7.2 1.4c-.5.6-1.3 1.1-2.1 1-.1-.8.3-1.7.7-2.2.5-.6 1.4-1 2.1-1 .1.9-.3 1.7-.7 2.2zm.7 1.1c-1.2-.1-2.2.7-2.8.7-.6 0-1.4-.6-2.3-.6-1.2 0-2.3.7-2.9 1.8-1.2 2.1-.3 5.2.9 6.9.6.8 1.3 1.7 2.2 1.7.9 0 1.2-.6 2.3-.6 1.1 0 1.4.6 2.3.6.9 0 1.5-.8 2.1-1.6.7-.9 1-1.9 1-1.9s-1.9-.7-1.9-2.8c0-1.8 1.5-2.6 1.6-2.7-1-.7-2.3-.8-2.8-.8zm8.1 1.1v9.8h1.8v-3.4h2.5c2.3 0 3.9-1.6 3.9-3.8 0-2.1-1.5-2.6-3.8-2.6h-4.4zm1.8 1.5h2.1c1.4 0 2.2.6 2.2 1.7 0 1.1-.8 1.8-2.2 1.8h-2.1V5.1zm9.2 8.3c1.2 0 2.3-.6 2.8-1.6h.1v1.5h1.7V8.4c0-1.8-1.4-2.9-3.6-2.9-2 0-3.5 1.1-3.6 2.7h1.7c.1-.8.8-1.3 1.8-1.3 1.2 0 1.8.6 1.8 1.5v.7l-2.4.1c-2.2.1-3.4 1-3.4 2.4 0 1.5 1.2 2.4 3.1 2.4zm.5-1.4c-1 0-1.6-.5-1.6-1.2 0-.7.6-1.2 1.8-1.3l2.1-.1v.7c0 1.1-.9 1.9-2.3 1.9zm6.8 1.4c.9 0 1.7-.5 2.1-1.2h.1v1h1.6v-5.4h-1.7v1c-.4-.7-1.1-1.1-2-1.1-1.7 0-2.9 1.5-2.9 3.4 0 1.9 1.2 3.3 2.8 3.3zm.4-1.4c-1 0-1.7-.8-1.7-1.9s.7-1.9 1.7-1.9 1.7.8 1.7 1.9-.7 1.9-1.7 1.9z" />
    </svg>
  );
}

export function GooglePayIcon({ className = "h-3.5 w-auto" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 44 16" fill="currentColor" aria-hidden>
      <path d="M8.2 6.8v2.6h3.6c-.2 1-1.1 2.9-3.6 2.9-2.2 0-4-1.8-4-4.1s1.8-4.1 4-4.1c1.2 0 2 .5 2.5.9l1.7-1.7C11.2 2.2 9.8 1.5 8.2 1.5 4.4 1.5 1.3 4.6 1.3 8.4s3.1 6.9 6.9 6.9c4 0 6.6-2.8 6.6-6.8 0-.5 0-.9-.1-1.2H8.2zm15.1 1.6c-2 0-3.7 1.5-3.7 3.6s1.7 3.6 3.7 3.6c2 0 3.3-1.2 4-2.9l-1.6-.7c-.5 1.2-1.4 2-2.4 2-1.3 0-2.3-1.1-2.3-2.6s1-2.6 2.3-2.6c.9 0 1.7.5 2.1 1.3l1.6-.7c-.6-1.5-1.9-2.4-3.7-2.4zm-5.8 0v7h1.7v-2.4h.1c.6 1 1.6 1.5 2.8 1.5 2 0 3.4-1.5 3.4-3.6s-1.4-3.6-3.3-3.6c-1.2 0-2.2.6-2.8 1.6h-.1V6.4h-1.8zm1.8 3.6c0-1.3.9-2.2 2.1-2.2 1.2 0 2.1.9 2.1 2.2s-.9 2.2-2.1 2.2c-1.2 0-2.1-.9-2.1-2.2zm12.8 3.4 2.1-5.9 2.1 5.9h1.9l3-7.8h-1.9l-1.7 4.9-1.7-4.9h-1.8l-1.7 4.9-1.7-4.9h-1.9l3 7.8h1.9z" />
    </svg>
  );
}

export function CardBrandIcon({
  brand,
  className = "h-5 w-auto",
}: {
  brand: CardBrand;
  className?: string;
}) {
  switch (brand) {
    case "visa":
      return <VisaIcon className={className} />;
    case "mastercard":
      return <MastercardIcon className={className} />;
    case "amex":
      return <AmexIcon className={className} />;
    case "discover":
      return <DiscoverIcon className={className} />;
    default:
      return null;
  }
}

export function AcceptedPaymentLogos() {
  const iconClass = "h-3.5 text-[#94A3B8] opacity-70";
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
      aria-label="Accepted payment methods"
    >
      <VisaIcon className={iconClass} />
      <MastercardIcon className={iconClass} />
      <AmexIcon className={iconClass} />
      <DiscoverIcon className={iconClass} />
      <ApplePayIcon className={iconClass} />
      <GooglePayIcon className={iconClass} />
    </div>
  );
}
