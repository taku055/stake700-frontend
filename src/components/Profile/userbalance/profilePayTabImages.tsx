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
