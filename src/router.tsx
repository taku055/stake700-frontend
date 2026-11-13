"use client";

import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Match = { params: Record<string, string>; rest: string };
type Scope = { rest: string | null };

const RouteScope = createContext<Scope>({ rest: null });

function normalize(pathname: string) {
  if (!pathname) return "/";
  const path = pathname.split("?")[0].split("#")[0];
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  if (withSlash !== "/" && withSlash.endsWith("/")) {
    return withSlash.replace(/\/+$/, "");
  }
  return withSlash || "/";
}

function segments(pathname: string) {
  if (pathname === "/") return [];
  return pathname.split("/").filter(Boolean);
}

export function matchRoute(pattern: string, pathname: string): Match | null {
  const path = normalize(pathname);
  if (pattern === "*" || pattern === "/*") {
    return { params: {}, rest: path };
  }

  const wildcard = pattern.endsWith("/*");
  const base = wildcard ? pattern.slice(0, -2) || "/" : pattern;
  const patternSegments = segments(normalize(base));
  const pathSegments = segments(path);

  if (!wildcard && patternSegments.length !== pathSegments.length) return null;
  if (wildcard && pathSegments.length < patternSegments.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternSegments.length; i += 1) {
    const expected = patternSegments[i];
    const actual = pathSegments[i];
    if (expected.startsWith(":")) {
      try {
        params[expected.slice(1)] = decodeURIComponent(actual);
      } catch {
        params[expected.slice(1)] = actual;
      }
    } else if (expected !== actual) {
      return null;
    }
  }

  const restSegments = wildcard ? pathSegments.slice(patternSegments.length) : [];
  const rest = restSegments.length ? `/${restSegments.join("/")}` : "/";
  return { params, rest };
}

export function LocationProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useLocation() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.toString();

  const query = useMemo(() => {
    const parsed: Record<string, string> = {};
    const params = new URLSearchParams(search);
    params.forEach((value, key) => {
      parsed[key] = value;
    });
    return parsed;
  }, [search]);

  const route = useCallback(
    (href: string, replace?: boolean) => {
      queueMicrotask(() => {
        if (replace) router.replace(href);
        else router.push(href);
      });
    },
    [router],
  );

  return useMemo(
    () => ({
      url: pathname + (search ? `?${search}` : ""),
      path: pathname,
      query,
      route,
    }),
    [pathname, search, query, route],
  );
}

function isComponent(value: unknown): value is ComponentType<any> {
  return typeof value === "function" || (typeof value === "object" && value !== null);
}

export function Route(_props: {
  path?: string;
  default?: boolean;
  component: ComponentType<any>;
  [key: string]: unknown;
}) {
  return null;
}

export function Router({ children }: { children: ReactNode }) {
  const { path } = useLocation();
  const parent = useContext(RouteScope);
  const scope = parent.rest ?? path;

  const items = Children.toArray(children).filter(isValidElement) as ReactElement<{
    path?: string;
    default?: boolean;
    component?: ComponentType<any>;
  }>[];

  let chosen: { props: Record<string, unknown>; match: Match } | null = null;
  for (const item of items) {
    const props = item.props as Record<string, unknown>;
    const pattern =
      typeof props.path === "string" ? props.path : props.default ? "*" : undefined;
    if (!pattern || !isComponent(props.component)) continue;
    const match = matchRoute(pattern, scope);
    if (match) {
      chosen = { props, match };
      break;
    }
  }

  if (!chosen) return null;

  const { component, path: _path, default: _default, ...rest } = chosen.props;
  const Comp = component as ComponentType<any>;

  return (
    <RouteScope.Provider value={{ rest: chosen.match.rest }}>
      <Comp {...rest} {...chosen.match.params} />
    </RouteScope.Provider>
  );
}
