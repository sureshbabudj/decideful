"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserMenu from "./user-menu";
import { useAuthStore } from "@/lib/stores/useAuthStore";

export const SITE_NAME = "Decideful";

export function Logo({
  className,
  ...rest
}: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      className={cn("h-6 w-6 text-primary", className)}
      fill="none"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g clipPath="url(#clip0_6_535)">
        <path
          clipRule="evenodd"
          d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="clip0_6_535">
          <rect fill="white" height="48" width="48" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function Header() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="w-full">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Logo />
          <h2 className="text-xl font-bold text-foreground uppercase">
            {SITE_NAME}
          </h2>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          <a
            className="text-muted-foreground hover:text-foreground transition-colors"
            href="#"
          >
            Features
          </a>
          <a
            className="text-muted-foreground hover:text-foreground transition-colors"
            href="#"
          >
            Pricing
          </a>
          <a
            className="text-muted-foreground hover:text-foreground transition-colors"
            href="#"
          >
            Support
          </a>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
