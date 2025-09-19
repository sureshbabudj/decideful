"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserMenu from "./user-menu";
import { useAuthStore } from "@/lib/store/auth-store";
import { SITE_NAME } from "@/lib/utils/static_data";
import { Logo } from "./logo";

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
