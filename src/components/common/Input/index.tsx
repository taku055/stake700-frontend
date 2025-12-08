import { JSX } from "preact/jsx-runtime";
import { useId } from "preact/hooks";
import { clsx } from "clsx";
import { forwardRef } from "preact/compat";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";

type ClassNames = {
  inputWrapper?: string;
  input?: string;
  label?: string;
  helper?: string;
  container?: string;
};

type Props = Omit<JSX.IntrinsicElements["input"], "class" | "onChange"> & {
  label: string;
  value?: string | null;
  defaultValue?: string;
  onChange?: (e: JSX.TargetedEvent<HTMLInputElement, Event>) => void;
  helperText?: string;
  error?: boolean | string;
  variant?: "bordered" | "flat";
  classNames?: ClassNames;
  startContent?: JSX.Element;
  endContent?: JSX.Element;
};

export const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      value,
      defaultValue,
      onChange,
      type = "text",
      helperText,
      error,
      variant = "bordered",
      classNames,
      startContent,
      endContent,
      id,
      ...rest
    }: Props,
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? `fi-${autoId}`;
    const describedBy = helperText ? `${inputId}-help` : undefined;
    const isRTL = RTL_LANGUAGES.includes(localeState.value);

    const borderBase =
      variant === "bordered"
        ? "border rounded-xl"
        : "border-0 border-b rounded-none";

    const errorRing = error
      ? "border-red-500 focus:ring-2 focus:ring-red-500/40"
      : "";

    return (
      <div class={clsx("w-full", classNames?.container)} dir={isRTL ? "rtl" : "ltr"}>
        <label htmlFor={inputId} class="block">
          <div
            class={clsx(
              "relative flex items-center",
              borderBase,
              "bg-[#fff1] border-none rounded-sm! hover:bg-[#fff2] focus-within:hover:bg-[#fff2]",
              "transition-colors",
              classNames?.inputWrapper,
              error && "border-red-500"
            )}
          >
            {/* Left slot (icon) */}
            {startContent && (
              <div class={clsx("shrink-0 pointer-events-none", isRTL ? "pr-3 pl-1" : "pl-3 pr-1")}>
                {startContent}
              </div>
            )}

            {/* The input is the "peer" that drives label animation */}
            <input
              id={inputId}
              ref={ref}
              type={type}
              value={value}
              defaultValue={defaultValue}
              onChange={onChange}
              placeholder=" " /* single space is required for :placeholder-shown */
              aria-invalid={!!error || undefined}
              aria-describedby={describedBy}
              dir={isRTL ? "rtl" : "ltr"}
              class={clsx(
                "peer w-full bg-transparent outline-none",
                "px-3 pt-5 pb-1",
                "text-white placeholder-transparent",
                isRTL ? "text-right" : "text-left",
                errorRing,
                classNames?.input
              )}
              {...rest}
            />

            {/* The floating label */}
            <span
              class={clsx(
                "pointer-events-none absolute",
                isRTL ? "right-3" : "left-3",
                // Base state = floated (top, small). When input is empty, the
                // peer-placeholder-shown rules below move it to the center.
                "top-2 text-xs leading-none",
                "transition-all duration-200 ease-out",
                // When the input is empty (placeholder-shown), sit in the middle
                "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[#9ca3af]",
                // On focus, ensure small and up
                "peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-white/80",
                classNames?.label
              )}
            >
              {label}
            </span>

            {/* Right slot (icon / action) */}
            {endContent && (
              <button
                type="button"
                tabIndex={-1}
                class={clsx("shrink-0", isRTL ? "pl-3 pr-1" : "pr-3 pl-1")}
                onMouseDown={(e) => e.preventDefault()}
              >
                {endContent}
              </button>
            )}
          </div>
        </label>

        {(helperText || typeof error === "string") && (
          <p
            id={describedBy}
            class={clsx(
              "mt-1 text-xs",
              typeof error === "string" || error
                ? "text-red-400"
                : "text-gray-400",
              classNames?.helper
            )}
          >
            {typeof error === "string" ? error : helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
