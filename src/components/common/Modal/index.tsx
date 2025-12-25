// Preact + TypeScript headless Modal primitives
// -------------------------------------------------
// Components: <Modal>, <ModalContent>, <ModalHeader>, <ModalBody>, <ModalFooter>
// Features
// - Shared state via context (open/close + custom shared data via `state` prop)
// - Controlled/uncontrolled open state (isOpen/onClose)
// - Backdrop with optional blur, click-outside to close, Escape to close
// - Focus trap inside the modal; restores focus to the trigger
// - Body scroll lock when open
// - Placement (center, top, bottom) and scrollBehavior (inside/outside)
// - Class overrides (className/classNames: { backdrop, wrapper, content })
// - Portals to document.body
// - Minimal styling; bring your own styles (Tailwind friendly)
// - RTL/LTR support via `dir` on <ModalContent>

import { createContext, h, JSX, VNode } from "preact";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "preact/hooks";
import { signal, type Signal } from "@preact/signals";
import { createPortal } from "preact/compat";

// -------------------------------------------------
// Context
// -------------------------------------------------

type SharedState = Record<string, unknown> | undefined;

interface ModalContextValue {
  open: Signal<boolean>;
  setOpen: (next: boolean) => void;
  close: () => void;
  backdrop: "none" | "blur";
  placement: "center" | "top" | "bottom";
  scrollBehavior: "inside" | "outside";
  closeOnBackdropClick: boolean;
  wrapperRef: preact.RefObject<HTMLDivElement>;
  contentRef: preact.RefObject<HTMLDivElement>;
  lastActiveElement: { current: Element | null };
  shared: SharedState;
  classNames?: {
    backdrop?: string;
    wrapper?: string;
    content?: string;
  };
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalInternal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Modal components must be used within <Modal>.");
  return ctx;
}

export function useModal<T extends SharedState = SharedState>() {
  return useModalInternal() as ModalContextValue & { shared: T };
}

// -------------------------------------------------
// Utilities
// -------------------------------------------------

function getTabbables(root: HTMLElement): HTMLElement[] {
  const selector = [
    "a[href]",
    "area[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "button:not([disabled])",
    "iframe",
    "object",
    "embed",
    "[contenteditable]",
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");
  const nodes = Array.from(root.querySelectorAll<HTMLElement>(selector));
  return nodes.filter(
    (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
  );
}

function useBodyScrollLock(locked: boolean) {
  useLayoutEffect(() => {
    if (!locked) return;
    const { body } = document;
    const original = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = original;
    };
  }, [locked]);
}

// -------------------------------------------------
// <Modal>
// -------------------------------------------------

interface ModalProps {
  children: preact.ComponentChildren;
  isOpen?: boolean; // controlled
  defaultOpen?: boolean; // uncontrolled
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void; // fires when closing
  backdrop?: "none" | "blur";
  placement?: "center" | "top" | "bottom";
  scrollBehavior?: "inside" | "outside";
  closeOnBackdropClick?: boolean;
  className?: string; // wrapper extra
  classNames?: { backdrop?: string; wrapper?: string; content?: string };
  state?: SharedState; // user-defined shared state
}

export function Modal({
  children,
  isOpen,
  defaultOpen = false,
  onOpenChange,
  onClose,
  backdrop = "none",
  placement = "center",
  scrollBehavior = "outside",
  closeOnBackdropClick = true,
  className,
  classNames,
  state,
}: ModalProps) {
  const controlled = typeof isOpen === "boolean";
  const openSig = useMemo(
    () => signal<boolean>(controlled ? !!isOpen : defaultOpen),
    []
  );

  useEffect(() => {
    if (controlled) openSig.value = !!isOpen;
  }, [isOpen]);

  const setOpen = (next: boolean) => {
    if (controlled) onOpenChange?.(next);
    else openSig.value = next;
    if (!next) onClose?.();
  };
  const close = () => setOpen(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastActiveElement = useRef<Element | null>(null);

  // Save/restore focus
  useEffect(() => {
    if (openSig.value) {
      lastActiveElement.current = document.activeElement as Element | null;
      // Move focus to first focusable within content after mount
      queueMicrotask(() => {
        const first = contentRef.current && getTabbables(contentRef.current)[0];
        (first || contentRef.current)?.focus?.();
      });
    } else if (lastActiveElement.current instanceof HTMLElement) {
      (lastActiveElement.current as HTMLElement).focus?.();
    }
  }, [openSig.value]);

  // Focus trap
  useEffect(() => {
    if (!openSig.value) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !contentRef.current) return;
      const tabbables = getTabbables(contentRef.current);
      if (tabbables.length === 0) return;
      const first = tabbables[0];
      const last = tabbables[tabbables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !contentRef.current.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [openSig.value]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!openSig.value) return;
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener("keydown", onKey, { capture: true });
    return () =>
      document.removeEventListener("keydown", onKey, { capture: true } as any);
  }, [openSig.value]);

  // Body lock
  useBodyScrollLock(openSig.value && scrollBehavior === "outside");

  const ctx: ModalContextValue = {
    open: openSig,
    setOpen,
    close,
    backdrop,
    placement,
    scrollBehavior,
    closeOnBackdropClick,
    wrapperRef,
    contentRef,
    lastActiveElement,
    shared: state,
    classNames,
  };

  return (
    <ModalContext.Provider value={ctx}>
      {openSig.value
        ? createPortal(
          <div
            aria-hidden={!openSig.value}
            className={["fixed inset-0 z-[1000]", className]
              .filter(Boolean)
              .join(" ")}
          >
            <Backdrop />
            <Wrapper>{children}</Wrapper>
          </div>,
          document.body
        )
        : null}
    </ModalContext.Provider>
  );
}

// -------------------------------------------------
// Backdrop (internal)
// -------------------------------------------------
function Backdrop() {
  const { close, backdrop, classNames, closeOnBackdropClick } =
    useModalInternal();
  return (
    <div
      role="presentation"
      onClick={() => {
        if (closeOnBackdropClick) close();
      }}
      className={[
        "absolute inset-0 bg-black/75",
        // backdrop === "blur" && "backdrop-blur-sm",
        classNames?.backdrop,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

// -------------------------------------------------
// Wrapper (internal container that handles placement)
// -------------------------------------------------
function Wrapper({ children }: { children: preact.ComponentChildren }) {
  const {
    placement,
    wrapperRef,
    scrollBehavior,
    classNames,
    closeOnBackdropClick,
    close,
  } = useModalInternal();
  const alignClass =
    placement === "center"
      ? "items-center"
      : placement === "top"
        ? "items-start"
        : "items-end";

  const onBackdropAreaPointerDown: JSX.MouseEventHandler<HTMLDivElement> = (
    e
  ) => {
    // Only close if the click is on the wrapper itself (i.e., outside the modal content)
    if (!closeOnBackdropClick) return;
    if (e.target === e.currentTarget) {
      close();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={[
        "absolute inset-0 flex justify-center p-1",
        alignClass,
        classNames?.wrapper,
      ]
        .filter(Boolean)
        .join(" ")}
      // If outside scrolling, Wrapper itself should scroll (content can be auto height)
      style={scrollBehavior === "outside" ? { overflowY: "auto" } : undefined}
      onMouseDown={onBackdropAreaPointerDown}
    >
      {children}
    </div>
  );
}

// -------------------------------------------------
// <ModalContent>
// -------------------------------------------------

interface ModalContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: preact.ComponentChildren;
  className?: string;
  dir?: "ltr" | "rtl" | "auto";
}

export function ModalContent({
  children,
  className,
  dir = "auto",
  ...rest
}: ModalContentProps) {
  const { contentRef, scrollBehavior, classNames } = useModalInternal();
  return (
    <div
      ref={contentRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      dir={dir}
      className={[
        "relative w-full rounded-xl shadow-xl outline-none focus:outline-none",
        classNames?.content,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        scrollBehavior === "inside"
          ? {  overflowY: "auto" }
          : undefined
      }
      {...rest}
    >
      {children}
      <ModalClose />
    </div>
  );
}

// -------------------------------------------------
// Close Button (exported)
// -------------------------------------------------

interface ModalCloseProps {
  className?: string;
  label?: string;
}
export function ModalClose({ className, label = "Close" }: ModalCloseProps) {
  const { close } = useModalInternal();
  return (
    <button
      type="button"
      aria-label={label}
      onClick={close}
      className={[
        "absolute top-3 right-3 inline-flex h-7 w-7 items-center justify-center rounded-md",
        "bg-transparent hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-black/20",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* X icon */}
      <svg
        width="14"
        height="15"
        viewBox="0 0 14 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 2.38531L8.4082 7.97711L14 13.5689L12.5918 14.9771L7 9.38531L1.4082 14.9771L0 13.5689L5.5918 7.97711L0 2.38531L1.4082 0.977112L7 6.56891L12.5918 0.977112L14 2.38531Z"
          fill="white"
          fill-opacity="0.6"
        />
      </svg>
    </button>
  );
}

// -------------------------------------------------
// <ModalHeader>, <ModalBody>, <ModalFooter>
// -------------------------------------------------

interface SectionProps {
  children: preact.ComponentChildren;
  className?: string;
}

export function ModalHeader({ children, className }: SectionProps) {
  return (
    <div
      className={[
        "px-6 py-4 text-lg font-semibold border-b-1 border-b-[#fff2]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export function ModalBody({ children, className }: SectionProps) {
  return (
    <div className={["px-6 py-4", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

export function ModalFooter({ children, className }: SectionProps) {
  return (
    <div
      className={["px-6 pt-2 pb-6 flex gap-3 justify-end", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

// -------------------------------------------------
// Example usage matching your snippet
// -------------------------------------------------

/*
import { signal } from '@preact/signals';
import { Modal, ModalContent, ModalBody } from './Modal';

const isOpen = signal(false);

function Example() {
  const onClose = () => { isOpen.value = false; };

  return (
    <>
      <button onClick={() => isOpen.value = true}>Open</button>
      <Modal
        backdrop="blur"
        isOpen={isOpen.value}
        onOpenChange={(open) => (isOpen.value = open)}
        onClose={onClose}
        placement="center"
        scrollBehavior="inside"
        classNames={{ backdrop: 'z-[10000000]', wrapper: 'z-[10000000]' }}
        state={{ featureFlag: true }}
      >
        <ModalContent
          className="w-[460px] bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] max-h-[calc(var(--viewport-height)*0.8)] overflow-y-auto"
          dir={'ltr'}
        >
          <ModalBody className="flex flex-col px-[24px] pb-[32px] pt-[32px]">
            <div className="flex flex-col w-full">
              <div className="flex items-center px-[96px] py-[24px]">
                <img src="/logo_white.png" alt="Logo" className="w-full" />
              </div>
              <div className="flex flex-row cursor-pointer bg-[#111111] rounded-[78px] px-[5px] py-[4px]">
                <div
                  className={
                    'flex-1 text-[16px] font-semibold px-[18px] rounded-[78px] text-center py-[5px] bg-[var(--primary-color)]'
                  }
                  onClick={() => console.log('Tab switch')}
                >
                  Log In
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
*/

// Notes
// - Access custom shared state inside children with: const { shared } = useModal<{ featureFlag: boolean }>();
// - Add animations by wrapping <ModalContent> with a transition (e.g., CSS or framer-motion).
// - For advanced stacking or nested modals, you may want a modal manager to handle focus/aria-hiding of background content.
