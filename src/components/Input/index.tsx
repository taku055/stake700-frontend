import { InputProps } from "@heroui/react";
import { useMemo } from "preact/hooks";
import type { JSX } from 'preact/jsx-runtime';

export default function Input(props: InputProps) {
  const inputProps: JSX.HTMLAttributes<HTMLInputElement> = useMemo(
    () => ({
      type: props.type,
      placeholder: props.placeholder,
      value: props.value,
      onChange: props.onChange,
      className:
        (props.className || "") +
        " w-full p-2 bg-[#222] rounded-md outline-none focus:border-1 focus:border-[var(--primary-color)]",
      name: props.name,
      autoFocus: props.autoFocus,
      required: props.required,
    }),
    [props]
  );
  return (
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-[#ccc] text-[12px]">{props.label}</label>
      <input
        {...inputProps}
        onFocus={(e) => {
          setTimeout(() => {
            (e.target as HTMLElement).scrollIntoView({
              behavior: "instant",
              block: "center",
            });
          }, 300); // slight delay helps when keyboard is opening
        }}
      />
    </div>
  );
}
