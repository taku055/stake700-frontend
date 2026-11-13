import type { ReactNode as ComponentChildren } from "react";

export default function ContentWrapper({
  children,
  className = "",
}: {
  children: ComponentChildren;
  className?: string;
}) {
  return (
    <div className={`w-full flex p-2 ${className}`}>
      <div className="w-full mx-auto">{children}</div>
    </div>
  );
}
