"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState } from "react";

const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH || "") : "";

function getHashPath(): string {
  if (typeof window === "undefined") return "/";
  const h = window.location.hash.slice(1);
  return h.startsWith("/") ? h : `/${h || ""}`;
}

type HashRouterContextType = {
  path: string;
  navigate: (path: string) => void;
};

const HashRouterContext = createContext<HashRouterContextType | null>(null);

export function HashRouterProvider({ children }: { children: React.ReactNode }) {
  const [path, setPath] = useState("/");

  useLayoutEffect(() => {
    setPath(getHashPath());
  }, []);

  useEffect(() => {
    const handleHashChange = () => setPath(getHashPath());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = useCallback((newPath: string) => {
    const p = newPath.startsWith("/") ? newPath : `/${newPath}`;
    window.location.hash = p;
    setPath(p);
  }, []);

  return (
    <HashRouterContext.Provider value={{ path, navigate }}>
      {children}
    </HashRouterContext.Provider>
  );
}

export function useHashPath() {
  const ctx = useContext(HashRouterContext);
  if (!ctx) throw new Error("useHashPath must be used within HashRouterProvider");
  return ctx.path;
}

export function useHashNavigate() {
  const ctx = useContext(HashRouterContext);
  if (!ctx) throw new Error("useHashNavigate must be used within HashRouterProvider");
  return ctx.navigate;
}

export function getHashHref(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const base = BASE ? (BASE.endsWith("/") ? BASE.slice(0, -1) : BASE) : "";
  return base ? `${base}#${p}` : `#${p}`;
}

export function getHashRedirectUrl(path: string): string {
  if (typeof window === "undefined") return `/#${path.startsWith("/") ? path : `/${path}`}`;
  const p = path.startsWith("/") ? path : `/${path}`;
  const base = BASE ? (BASE.endsWith("/") ? BASE.slice(0, -1) : BASE) : "";
  const pathname = base || "/";
  return `${window.location.origin}${pathname}#${p}`;
}

export function HashLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const hash = href.startsWith("#") ? href : `#${href.startsWith("/") ? href : `/${href}`}`;
  const pathPart = hash.startsWith("#") ? hash.slice(1) : hash;
  const rootPath = BASE ? (BASE.endsWith("/") ? BASE : `${BASE}/`) : "/";
  const h = rootPath + "#" + pathPart;
  return (
    <a href={h} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
