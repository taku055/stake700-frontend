// Sidebar.tsx
import { useEffect, useRef } from 'preact/hooks';
import type { FunctionComponent, ComponentChildren } from 'preact';

export type SidebarProps = {
  /** Controls whether the sidebar is open */
  isOpen: boolean;
  /** Called when the sidebar requests to close (backdrop click, Esc, close button) */
  onClose: () => void;
  /** Sidebar content */
  children: ComponentChildren;

  /** Show the built-in close button (default: true) */
  showCloseButton?: boolean;
  /** Close when pressing Escape (default: true) */
  closeOnEsc?: boolean;
  /** If true, clicking the backdrop will NOT close (default: false) */
  disableBackdropClose?: boolean;

  /** Class overrides */
  classNames?: {
    /** Wrapper that contains backdrop + panel (fixed full-screen container) */
    wrapper?: string;
    /** The semi-transparent backdrop */
    backdrop?: string;
    /** The sliding panel (set width here, e.g. w-[28rem]) */
    panel?: string;
    /** The header row that contains the close button */
    header?: string;
    /** Close button */
    closeButton?: string;
  };

  /** ARIA label for the close button (default: "Close sidebar") */
  closeButtonAriaLabel?: string;

  /** Optional role/labeling for a11y (defaults set for a dialog) */
  role?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  title?: string;
};

export const Sidebar: FunctionComponent<SidebarProps> = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  closeOnEsc = true,
  disableBackdropClose = false,
  classNames,
  closeButtonAriaLabel = 'Close sidebar',
  role = 'dialog',
  ariaLabel,
  ariaLabelledBy,
  title,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!closeOnEsc || !isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeOnEsc, onClose]);

  // Focus management: move focus when opening
  useEffect(() => {
    if (!isOpen) return;
    const id = requestAnimationFrame(() => {
      (closeBtnRef.current ?? panelRef.current)?.focus?.();
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <div
      aria-hidden={!isOpen}
      class={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'} ${classNames?.wrapper ?? ''}`}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-hidden="true"
        onClick={() => {
          if (!disableBackdropClose) onClose();
        }}
        class={[
          'absolute inset-0',
          'bg-black/50 transition-opacity duration-300 ease-out',
          isOpen ? 'opacity-100' : 'opacity-0',
          classNames?.backdrop ?? '',
        ].join(' ')}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role={role as any}
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        class={[
          'absolute inset-y-0 right-0',
          'bg-white dark:bg-neutral-900 shadow-2xl',
          'flex flex-col',
          'transition-transform duration-300 ease-out will-change-transform',
          isOpen ? 'translate-x-0' : 'translate-x-full',
          // default width; override via classNames.panel (appended last)
          'w-96',
          classNames?.panel ?? '',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {(showCloseButton || classNames?.header) && (
          <div
            class={[
              'flex items-center justify-between',
              'p-3 border-b border-neutral-200/70 dark:border-neutral-800',
              classNames?.header ?? '',
            ].join(' ')}
          >
            <div>{title || ""}</div>
            {showCloseButton && (
              <button
                ref={closeBtnRef}
                type="button"
                aria-label={closeButtonAriaLabel}
                onClick={onClose}
                class={[
                  'inline-flex items-center justify-center',
                  'h-9 w-9 rounded-xl',
                  'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400 dark:focus:ring-neutral-600',
                  'transition',
                  classNames?.closeButton ?? '',
                ].join(' ')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="h-5 w-5"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div class="min-h-0 flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
};
