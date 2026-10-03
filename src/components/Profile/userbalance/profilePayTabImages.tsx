/** Tab icons under `public/images/profile/` (PNG). */
export const PROFILE_PAY_TAB = {
  crypto: "/images/profile/cpay.png",
  visa: "/images/profile/vpay.png",
  epayClub: "/images/profile/vpay.png",
  googlePay: "/images/profile/gpay.png",
  applePay: "/images/profile/apay.png",
} as const;

export function ProfilePayTabTitle({ src, label }: { src: string; label: string }) {
  return (
    <div
      className="flex size-full items-center justify-center p-0 overflow-hidden"
      title={label}
    >
      <img
        src={src}
        alt=""
        className="size-full max-h-full max-w-full object-contain p-0"
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/** Image + text pill for payment method tabs. */
export function ProfilePayTextTabTitle({
  src,
  label,
  caption,
}: {
  src?: string;
  label: string;
  caption?: string;
}) {
  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2 text-left"
      title={caption ? `${caption} · ${label}` : label}
    >
      {src ? (
        <span className="flex h-8 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white/[0.06] p-1">
          <img
            src={src}
            alt=""
            className="max-h-full max-w-full object-contain"
            aria-hidden
          />
        </span>
      ) : null}
      <div className="flex min-w-0 flex-col items-start justify-center gap-0.5">
        {caption ? (
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-current/55 leading-none">
            {caption}
          </span>
        ) : null}
        <span className="text-[13px] font-semibold leading-tight whitespace-nowrap">
          {label}
        </span>
      </div>
    </div>
  );
}
