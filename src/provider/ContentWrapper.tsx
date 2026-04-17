import { ComponentChildren } from "preact";

export default function ContentWrapper({
  children,
}: {
  children: ComponentChildren;
}) {
  return (
    <div className="w-full flex p-2">
      <div className="max-w-[1200px] w-full mx-auto">{children}</div>
    </div>
  );
}
