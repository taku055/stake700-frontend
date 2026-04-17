import { ComponentChildren } from "preact";

export default function ContentWrapper({
  children,
}: {
  children: ComponentChildren;
}) {
  return (
    <div className="w-full flex p-2">
      <div className="w-full mx-auto">{children}</div>
    </div>
  );
}
