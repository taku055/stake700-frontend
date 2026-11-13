import { forwardRef, type ReactNode, type InputHTMLAttributes } from "react";
import { Modal, ModalContent } from "@/components/common";
import { ASSET_BASE_URL } from "@/config/constants";
import { Check, X } from "lucide-react";

/**
 * Shared building blocks for the login / signup dialogs.
 * All colours come from the site theme tokens in styles/_variables.scss.
 */

export function AuthModal({
  isOpen,
  onClose,
  title,
  subtitle,
  footer,
  size = "sm",
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  size?: "sm" | "md";
  children: ReactNode;
}) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME as string;
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      scrollBehavior="inside"
      classNames={{ wrapper: "p-3 sm:p-6" }}
    >
      <ModalContent
        noCloseButton
        aria-label={title}
        className={`flex w-full ${
          size === "md" ? "max-w-[520px]" : "max-w-[420px]"
        } max-h-[calc(var(--viewport-height)-24px)] flex-col overflow-hidden rounded-2xl border border-[var(--background-secondary)] bg-[var(--background)] text-white shadow-[0_24px_64px_-12px_rgba(0,0,0,0.6)]`}
        style={{ overflowY: "hidden" }}
      >
        {/* Scrollable body */}
        <div className="relative min-h-0 flex-1 overflow-y-auto">
          {/* soft brand glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(70%_100%_at_50%_0%,color-mix(in_srgb,var(--primary-color)_22%,transparent),transparent)]" />

          <div className="relative flex items-center justify-between px-6 pt-5">
            <img
              src={`${ASSET_BASE_URL}/logo.png`}
              alt={siteName}
              className="h-7 w-auto max-w-[140px] object-contain"
            />
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="-me-2 flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted-color)] transition-colors hover:bg-[var(--background-secondary)] hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative px-6 pb-6 pt-6">
            <h2 className="text-[22px] font-bold leading-tight tracking-[-0.01em]">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-[14px] text-[var(--text-muted-color)]">{subtitle}</p>
            )}
            <div className="mt-6">{children}</div>
          </div>
        </div>

        {footer && (
          <div className="shrink-0 border-t border-[var(--background-secondary)] bg-[var(--bar-background-color)] px-6 py-4 text-center text-[14px] text-[var(--text-muted-color)]">
            {footer}
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}

export const authLabel = "mb-1.5 block text-[13px] font-semibold text-[var(--text-muted-color)]";

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string;
  optional?: string;
  onChange: (value: string) => void;
  icon?: ReactNode;
  endContent?: ReactNode;
};

export const AuthField = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, optional, onChange, icon, endContent, className, id, name, ...rest }, ref) => {
    const fieldId = id || `auth-${name || label}`.replace(/\s+/g, "-").toLowerCase();
    return (
      <div className={className}>
        <label htmlFor={fieldId} className={authLabel}>
          {label}
          {optional && (
            <span className="ms-1 font-normal text-[var(--text-muted-color)]/70">({optional})</span>
          )}
        </label>
        <div className="group relative flex items-center">
          {icon && (
            <span className="pointer-events-none absolute start-3.5 flex text-[var(--background-tertiary)] transition-colors group-focus-within:text-[var(--primary-color)]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={fieldId}
            name={name}
            {...rest}
            onChange={(e) => onChange(e.target.value)}
            className={`h-11 w-full rounded-lg border border-[var(--background-secondary)] bg-[var(--bar-background-color)] text-[16px] text-white outline-none transition-[border-color,box-shadow] placeholder:text-[var(--background-tertiary)] hover:border-[var(--background-tertiary)] focus:border-[var(--primary-color)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary-color)_25%,transparent)] ${
              icon ? "ps-10" : "ps-3.5"
            } ${endContent ? "pe-11" : "pe-3.5"}`}
          />
          {endContent && <span className="absolute end-1.5 flex">{endContent}</span>}
        </div>
      </div>
    );
  }
);
AuthField.displayName = "AuthField";

export function PasswordToggle({ shown, onToggle }: { shown: boolean; onToggle: () => void }) {
  const Icon = shown ? EyeOffIcon : EyeIcon;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? "Hide password" : "Show password"}
      className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted-color)] transition-colors hover:bg-[var(--background-secondary)] hover:text-white"
    >
      <Icon />
    </button>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 7 10 7a17.6 17.6 0 0 1-2.16 3.19M6.6 6.6A17.4 17.4 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
      <path d="m2 2 20 20" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  );
}

export function AuthCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
}) {
  return (
    <label className="group inline-flex cursor-pointer select-none items-center gap-2.5 text-[14px] text-[var(--text-muted-color)] transition-colors hover:text-white">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--primary-color)]/50 ${
          checked
            ? "border-[var(--primary-color)] bg-[var(--primary-color)] text-white"
            : "border-[var(--background-tertiary)] bg-[var(--bar-background-color)] group-hover:border-[var(--text-muted-color)]"
        }`}
      >
        {checked && <Check size={12} strokeWidth={3.5} />}
      </span>
      <span className={checked ? "text-white" : undefined}>{label}</span>
    </label>
  );
}

export function AuthSectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--background-tertiary)]">
        {children}
      </span>
      <span className="h-px flex-1 bg-[var(--background-secondary)]" />
    </div>
  );
}

export const authPrimaryButton =
  "h-12 w-full rounded-lg bg-[var(--primary-color)]! text-[15px] font-semibold text-white! shadow-[0_8px_20px_-8px_var(--primary-color)] transition-colors hover:bg-[var(--primary-hover-color)]! data-[disabled=true]:opacity-60";

export const authLinkButton =
  "font-semibold text-white underline-offset-4 transition-colors hover:text-[var(--primary-color)] hover:underline";
