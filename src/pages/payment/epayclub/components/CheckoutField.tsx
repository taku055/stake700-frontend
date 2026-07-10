import { clsx } from "clsx";
import { useId, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import { CHECKOUT } from "./checkoutTheme";

type CheckoutFieldProps = Omit<
  JSX.IntrinsicElements["input"],
  "class" | "onChange" | "onInput"
> & {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  success?: boolean;
  helperText?: string;
  startContent?: JSX.Element;
  endContent?: JSX.Element;
  inputRef?: (el: HTMLInputElement | null) => void;
  onBlurValidate?: () => void;
};

export function CheckoutField({
  label,
  value,
  onValueChange,
  error,
  success,
  helperText,
  startContent,
  endContent,
  inputRef,
  onBlurValidate,
  id,
  disabled,
  ...rest
}: CheckoutFieldProps) {
  const autoId = useId();
  const inputId = id ?? `checkout-${autoId}`;
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  const hasError = Boolean(error);
  const describedBy = [
    helperText ? `${inputId}-helper` : null,
    hasError ? `${inputId}-error` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full">
      <div
        className={clsx(
          "relative rounded-xl border bg-[#0F1624] transition-[border-color,box-shadow,background-color]",
          "duration-200 ease-out",
          disabled && "opacity-60",
          hasError
            ? "border-[#F87171]/60"
            : success
              ? "border-[#00C16A]/50"
              : focused
                ? "border-[#00C16A]/40 shadow-[0_0_0_3px_rgba(0,193,106,0.12)]"
                : "border-[rgba(255,255,255,0.08)]",
        )}
      >
        {startContent ? (
          <div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#94A3B8]">
            {startContent}
          </div>
        ) : null}

        <input
          {...rest}
          id={inputId}
          ref={inputRef}
          value={value}
          disabled={disabled}
          placeholder=" "
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy || undefined}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlurValidate?.();
            rest.onBlur?.(e);
          }}
          onInput={(e) =>
            onValueChange((e.currentTarget as HTMLInputElement).value)
          }
          className={clsx(
            "peer block w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-[15px] text-[#F8FAFC] outline-none",
            "placeholder:text-transparent transition-colors duration-200",
            startContent && "pl-11",
            endContent && "pr-11",
            disabled && "cursor-not-allowed",
          )}
          style={{ caretColor: CHECKOUT.primary }}
        />

        <label
          htmlFor={inputId}
          className={clsx(
            "pointer-events-none absolute left-4 origin-left text-[#94A3B8] transition-all duration-200 ease-out",
            startContent && "left-11",
            floated
              ? "top-2 text-[11px] font-medium tracking-wide"
              : "top-1/2 -translate-y-1/2 text-[15px]",
            hasError && floated && "text-[#F87171]",
            success && floated && !hasError && "text-[#00C16A]",
            focused && !hasError && "text-[#00C16A]",
          )}
        >
          {label}
        </label>

        {endContent ? (
          <div className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-[#94A3B8]">
            {endContent}
          </div>
        ) : null}
      </div>

      {hasError ? (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-xs text-[#F87171]"
          role="alert"
        >
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-[#94A3B8]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
