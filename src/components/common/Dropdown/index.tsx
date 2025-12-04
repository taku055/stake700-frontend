// Preact + TypeScript headless Dropdown primitives (with portal positioning)
// -----------------------------------------------------------------------------

import { h, JSX, VNode, createContext } from "preact";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "preact/hooks";
import { signal, type Signal, computed } from "@preact/signals";
import { cloneElement, isValidElement, createPortal } from "preact/compat";

// -------------------------------------------------
// Context
// -------------------------------------------------

type DropdownShared = Record<string, unknown> | undefined;

interface DropdownContextValue {
  open: Signal<boolean>;
  setOpen: (next: boolean) => void;
  toggle: () => void;
  close: () => void;
  triggerRef: preact.RefObject<HTMLElement>;
  menuRef: preact.RefObject<HTMLDivElement>;
  items: Array<HTMLElement | null>;
  registerItem: (el: HTMLElement | null) => number; // returns index
  focusItem: (index: number) => void;
  focusedIndex: Signal<number>;
  itemCount: Signal<number>;
  shared: DropdownShared;
  portalContainer: HTMLElement | null; // NEW
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownInternal(): DropdownContextValue {
  const ctx = useContext(DropdownContext);
  if (!ctx)
    throw new Error("Dropdown components must be used inside <Dropdown>.");
  return ctx;
}

// -------------------------------------------------
// <Dropdown>
// -------------------------------------------------

interface DropdownProps {
  children: preact.ComponentChildren;
  className?: string;
  open?: boolean; // controlled (optional)
  onOpenChange?: (open: boolean) => void;
  state?: DropdownShared; // custom data shared via context
  backdrop?: "none" | "blur";
  portalContainer?: HTMLElement | null; // NEW: default document.body
}

export function Dropdown({
  children,
  className,
  open,
  onOpenChange,
  state,
  backdrop = "none",
  portalContainer,
}: DropdownProps) {
  const isControlled = typeof open === "boolean";
  const openSig = useMemo(() => signal<boolean>(!!open), []);
  // keep controlled prop in sync
  useEffect(() => {
    if (isControlled) openSig.value = !!open;
  }, [open]);

  const setOpen = (next: boolean) => {
    if (isControlled) onOpenChange?.(next);
    else openSig.value = next;
  };

  const toggle = () => setOpen(!openSig.value);
  const close = () => setOpen(false);

  const triggerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLElement | null>>([]);
  const focusedIndex = useMemo(() => signal(-1), []);
  const itemCount = useMemo(() => computed(() => itemsRef.current.length), []);

  const registerItem = (el: HTMLElement | null) => {
    const idx = itemsRef.current.indexOf(el);
    if (idx === -1) {
      itemsRef.current.push(el);
      return itemsRef.current.length - 1;
    }
    return idx;
  };

  const focusItem = (index: number) => {
    const clamped = Math.max(-1, Math.min(index, itemsRef.current.length - 1));
    focusedIndex.value = clamped;
    if (clamped >= 0) itemsRef.current[clamped]?.focus();
  };

  // Close on click outside + Escape
  useEffect(() => {
    function onDocPointerDown(e: MouseEvent) {
      if (!openSig.value) return;
      const t = e.target as Node | null;
      const inTrigger = triggerRef.current?.contains(t as Node) ?? false;
      const inMenu = menuRef.current?.contains(t as Node) ?? false;
      if (!inTrigger && !inMenu) close();
    }
    function onKey(e: KeyboardEvent) {
      if (!openSig.value) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onDocPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const value: DropdownContextValue = {
    open: openSig,
    setOpen,
    toggle,
    close,
    triggerRef: triggerRef as any,
    menuRef,
    items: itemsRef.current,
    registerItem,
    focusItem,
    focusedIndex,
    itemCount,
    shared: state,
    portalContainer:
      typeof document !== "undefined"
        ? portalContainer ?? document.body
        : null,
  };

  return (
    <DropdownContext.Provider value={value}>
      <div
        className={["relative inline-block", className]
          .filter(Boolean)
          .join(" ")}
        data-backdrop={backdrop}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// -------------------------------------------------
// <DropdownTrigger>
// -------------------------------------------------

interface DropdownTriggerProps {
  children: preact.ComponentChildren;
  asChild?: boolean; // when true, we clone the only child and attach props
}

export function DropdownTrigger({
  children,
  asChild = false,
}: DropdownTriggerProps) {
  const { toggle, open, triggerRef, focusItem } = useDropdownInternal();

  const commonProps: JSX.HTMLAttributes<HTMLElement> = {
    "aria-haspopup": "menu",
    "aria-expanded": open.value,
    onClick: (e: MouseEvent) => {
      e.preventDefault();
      toggle();
    },
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!open.value) toggle();
        queueMicrotask(() => focusItem(0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!open.value) toggle();
        queueMicrotask(() => focusItem(Number.MAX_SAFE_INTEGER));
      }
    },
  } as any;

  if (asChild) {
    const child = children as VNode<any>;
    if (!isValidElement(child)) {
      throw new Error(
        "<DropdownTrigger asChild> expects a single valid element child."
      );
    }
    return cloneElement(child, { ...commonProps, ref: triggerRef });
  }

  return (
    <button
      type="button"
      {...(commonProps as any)}
      ref={triggerRef as any}
      className="appearance-none bg-transparent p-0 border-0 w-full"
    >
      {children}
    </button>
  );
}

// -------------------------------------------------
// <DropdownMenu> (portal + fixed positioning)
// -------------------------------------------------

interface DropdownMenuProps {
  children: preact.ComponentChildren;
  className?: string;
  ariaLabel?: string;
  align?: "start" | "end" | "center";
  widthMatchTrigger?: boolean;
  portal?: boolean; // NEW (default true)
}

export function DropdownMenu({
  children,
  className,
  ariaLabel = "Menu",
  align = "start",
  widthMatchTrigger = false,
  portal = true,
}: DropdownMenuProps) {
  const {
    open,
    menuRef,
    triggerRef,
    items,
    focusItem,
    focusedIndex,
    portalContainer,
  } = useDropdownInternal();

  if (!open.value) return null;

  const content = (
    <MenuContent
      menuRef={menuRef}
      triggerRef={triggerRef}
      align={align}
      widthMatchTrigger={widthMatchTrigger}
      ariaLabel={ariaLabel}
      className={className}
      items={items}
      focusItem={focusItem}
      focusedIndex={focusedIndex}
    >
      {children}
    </MenuContent>
  );

  // If portal is disabled or no container (SSR guard), render inline (legacy)
  if (!portal || !portalContainer) return content;

  return createPortal(content, portalContainer);
}

function MenuContent({
  menuRef,
  triggerRef,
  align,
  widthMatchTrigger,
  ariaLabel,
  className,
  items,
  focusItem,
  focusedIndex,
  children,
}: {
  menuRef: preact.RefObject<HTMLDivElement>;
  triggerRef: preact.RefObject<HTMLElement>;
  align: "start" | "end" | "center";
  widthMatchTrigger: boolean;
  ariaLabel: string;
  className?: string;
  items: Array<HTMLElement | null>;
  focusItem: (i: number) => void;
  focusedIndex: Signal<number>;
  children: preact.ComponentChildren;
}) {
  const styleRef = useRef<JSX.CSSProperties>({ position: "fixed" });

  const computePosition = () => {
    const trig = triggerRef.current;
    const menu = menuRef.current;
    if (!trig || !menu) return;

    const rect = trig.getBoundingClientRect();

    // horizontal anchor
    let left = rect.left;
    let transform = "";
    if (align === "end") {
      left = rect.right;
      transform = "translateX(-100%)";
    } else if (align === "center") {
      left = rect.left + rect.width / 2;
      transform = "translateX(-50%)";
    }

    // vertical placement (simple: under the trigger)
    const top = rect.bottom;

    const next: JSX.CSSProperties = {
      position: "fixed",
      top: top + "px",
      left: left + "px",
      transform,
      zIndex: 50,
      maxHeight: "60vh",
      outline: "none",
      // keep margin-top visually similar to your original `mt-2`
      marginTop: "0.5rem",
      // background & radius are kept in className for styling flexibility
    };

    if (widthMatchTrigger) {
      next.minWidth = rect.width;
    }
    //console.log(next);

    styleRef.current = next;

    // Apply immediately to avoid flicker
    for (const [k, v] of Object.entries(next)) {
      (menu.style as any)[k] = v as any;
    }
  };

  // Reposition on open/scroll/resize and when trigger/menu resizes
  useLayoutEffect(() => {
    computePosition();

    const onReposition = () => computePosition();

    // capture true to catch inner scrollables
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);

    const trig = triggerRef.current;
    const menu = menuRef.current;

    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(onReposition)
      : null;
    if (ro && trig) ro.observe(trig);
    if (ro && menu) ro.observe(menu);

    return () => {
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
      if (ro) ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label={ariaLabel}
      className={[
        "overflow-auto rounded-md shadow-lg bg-[#0b1a35] outline-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      tabIndex={-1}
      onKeyDown={(e) => {
        const max = items.length - 1;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const next = Math.min(max, focusedIndex.value + 1);
          focusItem(next < 0 ? 0 : next);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prev = Math.max(0, focusedIndex.value - 1);
          focusItem(prev);
        } else if (e.key === "Home") {
          e.preventDefault();
          focusItem(0);
        } else if (e.key === "End") {
          e.preventDefault();
          focusItem(max);
        }
      }}
      // fallback style (also kept updated via computePosition)
      style={styleRef.current}
    >
      {children}
    </div>
  );
}

// -------------------------------------------------
// <DropdownItem>
// -------------------------------------------------

interface DropdownItemProps {
  children: preact.ComponentChildren;
  className?: string;
  value?: string;
  disabled?: boolean;
  onPress?: () => void | Promise<void>;
}

export function DropdownItem({
  children,
  className,
  value,
  disabled = false,
  onPress,
}: DropdownItemProps) {
  const { registerItem, close, focusedIndex } = useDropdownInternal();
  const indexRef = useRef<number>(-1);
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    indexRef.current = registerItem(elRef.current);
  }, []);

  const handleActivate = async () => {
    if (disabled) return;
    try {
      await onPress?.();
    } finally {
      close();
    }
  };

  const isFocused = computed(() => focusedIndex.value === indexRef.current);

  return (
    <div
      ref={elRef}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      data-value={value}
      onClick={(e) => {
        e.preventDefault();
        handleActivate();
      }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
      onMouseMove={() => {
        if (!disabled && indexRef.current >= 0)
          focusedIndex.value = indexRef.current;
      }}
      className={[
        "cursor-pointer select-none outline-none px-3 py-2 rounded-sm",
        disabled
          ? "opacity-60 pointer-events-none"
          : "hover:bg-[#041e52] focus:bg-[#041e52]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      // tiny focus style helper if you want to use `isFocused` signal
      data-focused={isFocused.value || undefined}
    >
      {children}
    </div>
  );
}

// -------------------------------------------------
// Hook for accessing shared custom state inside any subcomponent
// -------------------------------------------------
export function useDropdown<T extends DropdownShared = DropdownShared>() {
  const ctx = useDropdownInternal();
  return ctx as DropdownContextValue & { shared: T };
}
