"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

type ToValue = LinkProps["href"];

type CompatLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: ToValue;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
};

export const BrowserRouter = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const Routes = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export function Route({
  element,
}: {
  path?: string;
  element: React.ReactNode;
}) {
  return <>{element}</>;
}

export function useNavigate() {
  const router = useRouter();

  return React.useCallback(
    (to: ToValue, options?: { replace?: boolean }) => {
      const href = typeof to === "string" ? to : String(to);
      if (options?.replace) {
        router.replace(href);
        return;
      }
      router.push(href);
    },
    [router],
  );
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? "";

  return React.useMemo(
    () => ({
      pathname: pathname ?? "/",
      search: search ? `?${search}` : "",
      hash: "",
      state: null,
      key: pathname ?? "/",
    }),
    [pathname, search],
  );
}

export const CompatLink = React.forwardRef<HTMLAnchorElement, CompatLinkProps>(
  ({ to, replace, scroll, prefetch, ...rest }, ref) => (
    <Link
      href={to}
      replace={replace}
      scroll={scroll}
      prefetch={prefetch}
      {...rest}
      ref={ref}
    />
  ),
);

CompatLink.displayName = "CompatLink";

export { CompatLink as Link };
