import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import UserMenu from "../common/user-menu";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-border px-4 py-3">
      <SidebarTrigger />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <UserMenu />
      </div>
    </header>
  );
}
