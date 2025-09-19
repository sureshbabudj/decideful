import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { SITE_NAME } from "@/lib/utils/static_data";
import { Logo } from "../common/logo";
import Link from "next/link";
import UserMenu from "../common/user-menu";
import { useSidebar } from "@/components/ui/sidebar";

export function Header() {
  const { open } = useSidebar();
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid bg-background p-4 shadow-sm">
      <div className="flex items-center gap-3 text-foreground/80">
        <SidebarTrigger />
        {!open && (
          <>
            <Logo />
            <h1 className="text-xl font-bold tracking-tight hidden md:block">
              {SITE_NAME}
            </h1>
          </>
        )}
      </div>
      <nav className="hidden items-center gap-8 md:flex">
        <Link
          className="text-sm font-medium text-foreground/60 hover:text-primary"
          href="/"
        >
          Home
        </Link>
        <Link
          className="text-sm font-medium text-foreground/60 hover:text-primary"
          href="/decisions"
        >
          Decisions
        </Link>
        <Link
          className="text-sm font-medium text-foreground/60 hover:text-primary"
          href="/insights"
        >
          Insights
        </Link>
        <Link
          className="text-sm font-medium text-foreground/60 hover:text-primary"
          href="/templates"
        >
          Templates
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon">
          <Mail className="h-5 w-5 text-foreground/60" />
        </Button>
        <UserMenu />
      </div>
    </header>
  );
}
