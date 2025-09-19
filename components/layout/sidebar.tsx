import {
  Mail,
  Calendar,
  Trophy,
  Settings,
  UserCog2Icon,
  Home,
} from "lucide-react";
import {
  Sidebar as UiSideBar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import Link from "next/link";
import { SITE_NAME } from "@/lib/utils/static_data";
import { Logo } from "../common/logo";

export function Sidebar() {
  return (
    <UiSideBar>
      <SidebarHeader>
        <div className="p-6 flex items-center gap-3">
          <Logo />
          <h1 className="text-2xl font-bold text-foreground/80">{SITE_NAME}</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <nav className="flex-grow px-4">
                <SidebarMenuButton
                  asChild
                  className="flex items-center gap-3 w-full py-2"
                >
                  <Link href="/">
                    <Home className="h-5 w-5 text-foreground/60" />
                    <span className="font-medium">Back to Home</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton
                  asChild
                  className="flex items-center gap-3 w-full py-2"
                >
                  <Link href="/decisions">
                    <Mail className="h-5 w-5 text-foreground/60" />
                    <span className="font-medium">Decisions</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton
                  asChild
                  className="flex items-center gap-3 w-full py-2"
                >
                  <Link href="/insights">
                    <Calendar className="h-5 w-5 text-foreground/60" />
                    <span className="font-medium">Insights</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton
                  asChild
                  className="flex items-center gap-3 w-full py-2"
                >
                  <Link href="/templates">
                    <Trophy className="h-5 w-5 text-foreground/60" />
                    <span className="font-medium">Templates</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton
                  asChild
                  className="flex items-center gap-3 w-full py-2"
                >
                  <Link href="/settings">
                    <Settings className="h-5 w-5 text-foreground/60" />
                    <span className="font-medium">Settings</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton
                  asChild
                  className="flex items-center gap-3 w-full py-2"
                >
                  <Link href="/profile">
                    <UserCog2Icon className="h-5 w-5 text-foreground/60" />
                    <span className="font-medium">Profile</span>
                  </Link>
                </SidebarMenuButton>
              </nav>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Link href="/decisions/new" className="p-6">
          <Button variant="outline" className="w-full">
            New Decision
          </Button>
        </Link>
      </SidebarFooter>
    </UiSideBar>
  );
}
